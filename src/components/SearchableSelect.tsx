import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Pencil, Trash2, Plus, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder,
  searchPlaceholder = "ស្វែងរក...",
  className = "",
  triggerClassName = "px-3 py-2 border border-slate-200 bg-white rounded-lg",
  required = false,
  onEditOption,
  onDeleteOption,
  onAddOption,
  addPlaceholder = "+ បន្ថែមថ្មី..."
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Editing states for custom management inside SearchableSelect
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [deletingValue, setDeletingValue] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setEditingIndex(null);
        setDeletingValue(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.value === value);
  const filteredOptions = options.filter((opt: any) => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full cursor-pointer flex justify-between items-center transition-all ${triggerClassName} ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-slate-500' : 'text-slate-800'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {required && !value && (
        <input type="text" className="absolute opacity-0 w-0 h-0 p-0 m-0 bottom-0 pointer-events-none" required />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto dropdown-scrollbar p-1.5 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-xs text-slate-500 text-center">គ្មានទិន្នន័យ</div>
              ) : (
                filteredOptions.map((opt: any, idx: number) => {
                  const isEditing = editingIndex === idx;
                  const isSelected = value === opt.value;

                  return (
                    <div
                      key={opt.value}
                      className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors group ${
                        isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (onEditOption && editingValue.trim()) {
                                  onEditOption(opt.value, editingValue.trim());
                                }
                                setEditingIndex(null);
                              } else if (e.key === "Escape") {
                                setEditingIndex(null);
                              }
                            }}
                            className="flex-1 px-2 py-1 text-xs border border-blue-200 rounded-md focus:outline-none focus:border-blue-500 bg-white font-bold text-slate-700"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onEditOption && editingValue.trim()) {
                                onEditOption(opt.value, editingValue.trim());
                              }
                              setEditingIndex(null);
                            }}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingIndex(null);
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
                              onChange(opt.value);
                              setIsOpen(false);
                              setSearch("");
                            }}
                            className="flex-1 text-left font-bold cursor-pointer pr-4 truncate"
                          >
                            {opt.label}
                          </button>
                          {(onEditOption || onDeleteOption) && (
                            <div className={`flex items-center gap-0.5 transition-opacity shrink-0 ${
                              deletingValue === opt.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
                            }`}>
                              {onDeleteOption && deletingValue === opt.value ? (
                                <div className="flex items-center gap-1 bg-rose-50 px-1.5 py-0.5 rounded-lg border border-rose-200/60" onClick={(e) => e.stopPropagation()}>
                                  <span className="text-[10px] text-rose-700 font-extrabold shrink-0">លុប?</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteOption(opt.value);
                                      setDeletingValue(null);
                                    }}
                                    className="p-0.5 text-emerald-600 hover:bg-emerald-100/80 rounded-md cursor-pointer shrink-0"
                                    title="បញ្ជាក់ការលុប (Confirm)"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingValue(null);
                                    }}
                                    className="p-0.5 text-slate-400 hover:bg-slate-100 rounded-md cursor-pointer shrink-0"
                                    title="បោះបង់ (Cancel)"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {onEditOption && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingIndex(idx);
                                        setEditingValue(opt.value);
                                        setDeletingValue(null);
                                      }}
                                      className="p-1 text-blue-500 hover:bg-blue-100/50 rounded-md cursor-pointer"
                                      title="កែប្រែ (Edit)"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {onDeleteOption && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingValue(opt.value);
                                      }}
                                      className="p-1 text-rose-500 hover:bg-rose-100/50 rounded-md cursor-pointer"
                                      title="លុប (Delete)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add New Option section at the bottom */}
            {onAddOption && (
              <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-1.5 shrink-0">
                <input
                  type="text"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder={addPlaceholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newOptionValue.trim()) {
                        onAddOption(newOptionValue.trim());
                        setNewOptionValue("");
                      }
                    }
                  }}
                  className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white font-bold text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newOptionValue.trim()) {
                      onAddOption(newOptionValue.trim());
                      setNewOptionValue("");
                    }
                  }}
                  className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-3xs shrink-0 flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
