import React, { useState, useEffect } from "react";

import { withSafeCss } from "./Dashboard";
import { exportToExcel } from "../exportUtils";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Loader2, Plus, Printer, FileSpreadsheet, Download, Search, Edit, Trash2, X, Check, Save, AlertTriangle, Package, DollarSign, CheckCircle, SlidersHorizontal, ChevronDown, Tag } from 'lucide-react';

export interface Asset {
  id: string;
  nameKh: string;
  nameEn: string;
  descriptionKh: string;
  descriptionEn: string;
  category: string;
  quantity: number;
  unitPrice: number;
  location: string;
  personInCharge: string;
  status: string;
  purchaseDate?: string;
}

export interface AssetSale {
  id: string;
  assetId: string;
  nameKh: string;
  nameEn: string;
  category: string;
  quantitySold: number;
  pricePerUnit: number;
  totalRevenue: number;
  saleDate: string;
  note: string;
}

interface AssetsTabProps {
  uiLang: string;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export const toKhmerNumber = (num: number | string): string => {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num).split("").map(char => {
    const digit = parseInt(char, 10);
    return isNaN(digit) ? char : khmerDigits[digit];
  }).join("");
};

export const formatKhmerPrice = (price: number): string => {
  const formatted = price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `$${formatted}`;
};

export default function AssetsTab({ uiLang, showToast }: AssetsTabProps) {
  // Initial seed data is empty for a clean state
  const defaultAssets: Asset[] = [];

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem("plc_school_assets");
    return saved ? JSON.parse(saved) : defaultAssets;
  });

  useEffect(() => {
    localStorage.setItem("plc_school_assets", JSON.stringify(assets));
  }, [assets]);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>("ទាំងអស់ (All)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSavingPDF, setIsSavingPDF] = useState(false);

  const [statusFilter, setStatusFilter] = useState("ទាំងអស់ (All)");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Sales tab search & filters state
  const [salesSearchQuery, setSalesSearchQuery] = useState("");
  const [salesStartDate, setSalesStartDate] = useState("");
  const [salesEndDate, setSalesEndDate] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);

  // Custom delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "asset" | "category" | "status";
    targetId: string;
    nameKh: string;
    nameEn: string;
    messageKh: string;
    messageEn: string;
    onConfirm: () => void;
  } | null>(null);

  // View mode state ("inventory" | "sales")
  const [viewMode, setViewMode] = useState<"inventory" | "sales">("inventory");

  // Sales State with Persistence
  const [sales, setSales] = useState<AssetSale[]>(() => {
    const saved = localStorage.getItem("plc_school_asset_sales");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("plc_school_asset_sales", JSON.stringify(sales));
  }, [sales]);

  // Sell Modal State
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellAsset, setSellAsset] = useState<Asset | null>(null);
  const [sellQuantity, setSellQuantity] = useState<number>(1);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [sellDate, setSellDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [sellNote, setSellNote] = useState("");

  // Edit Sale Modal State
  const [showEditSaleModal, setShowEditSaleModal] = useState(false);
  const [editSaleTarget, setEditSaleTarget] = useState<AssetSale | null>(null);
  const [editSaleQuantity, setEditSaleQuantity] = useState<number>(1);
  const [editSalePrice, setEditSalePrice] = useState<number>(0);
  const [editSaleDate, setEditSaleDate] = useState<string>("");
  const [editSaleNote, setEditSaleNote] = useState("");

  // Form State
  const [formNameKh, setFormNameKh] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formDescKh, setFormDescKh] = useState("");
  const [formDescEn, setFormDescEn] = useState("");
  const [formCategory, setFormCategory] = useState("កុំព្យូទ័រ និងបច្ចេកវិទ្យា");
  const [formQuantity, setFormQuantity] = useState<number>(1);
  const [formUnitPrice, setFormUnitPrice] = useState<number>(0);
  const [formLocation, setFormLocation] = useState("");
  const [formPerson, setFormPerson] = useState("");
  const [formStatus, setFormStatus] = useState<string>("ល្អឥតខ្ចោះ");
  const [formPurchaseDate, setFormPurchaseDate] = useState("");

  // Dynamic Statuses State with Persistence
  const [statuses, setStatuses] = useState<string[]>(() => {
    const saved = localStorage.getItem("plc_school_asset_statuses");
    return saved ? JSON.parse(saved) : [
      "ល្អឥតខ្ចោះ",
      "ល្អ",
      "មធ្យម",
      "ខូច/ខូចខាត",
      "កំពុងជួសជុល"
    ];
  });

  useEffect(() => {
    localStorage.setItem("plc_school_asset_statuses", JSON.stringify(statuses));
  }, [statuses]);

  // Status Management State
  const [showManageStatuses, setShowManageStatuses] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [editingStatusIndex, setEditingStatusIndex] = useState<number | null>(null);
  const [editingStatusValue, setEditingStatusValue] = useState("");

  // Dynamic Categories State with Persistence
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("plc_school_asset_categories");
    return saved ? JSON.parse(saved) : [
      "កុំព្យូទ័រ និងបច្ចេកវិទ្យា",
      "ឧបករណ៍មន្ទីរពិសោធន៍",
      "គ្រឿងសង្ហារឹមថ្នាក់រៀន",
      "សៀវភៅសិក្សា និងសម្ភារៈសិក្សា",
      "សម្ភារៈការិយាល័យ"
    ];
  });

  useEffect(() => {
    localStorage.setItem("plc_school_asset_categories", JSON.stringify(categories));
  }, [categories]);

  // Category Management State
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");

  // Handler to add a new category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      showToast(idt("សូមបញ្ចូលឈ្មោះប្រភេទសម្ភារៈ!", "Please enter a category name!", "请输入类别名称！"), "error");
      return;
    }
    if (categories.includes(trimmed)) {
      showToast(idt("ប្រភេទនេះមានរួចហើយ!", "This category already exists!", "此类别已存在！"), "error");
      return;
    }

    setCategories(prev => [...prev, trimmed]);
    setNewCategoryName("");
    showToast(idt("បានបន្ថែមប្រភេទសម្ភារៈថ្មីជោគជ័យ!", "Successfully added new category!", "成功添加新类别！"), "success");
  };

  // Handler to update a category (and update all matching assets and current filter/form choices)
  const handleEditCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      showToast(idt("ឈ្មោះប្រភេទមិនអាចទទេបានទេ!", "Category name cannot be empty!", "类别名称不能为空！"), "error");
      return;
    }
    if (trimmed === oldName) {
      setEditingCategoryIndex(null);
      return;
    }
    if (categories.includes(trimmed)) {
      showToast(idt("ប្រភេទនេះមានរួចហើយ!", "This category already exists!", "此类别已存在！"), "error");
      return;
    }

    // Update categories
    setCategories(prev => prev.map(c => c === oldName ? trimmed : c));

    // Cascade update assets
    setAssets(prev => prev.map(item => {
      if (item.category === oldName) {
        return { ...item, category: trimmed };
      }
      return item;
    }));

    // Cascade update selection values
    if (selectedCategory === oldName) {
      setSelectedCategory(trimmed);
    }
    if (formCategory === oldName) {
      setFormCategory(trimmed);
    }

    setEditingCategoryIndex(null);
    showToast(idt("បានកែប្រែប្រភេទសម្ភារៈជោគជ័យ!", "Successfully updated category!", "成功更新类别！"), "success");
  };

  // Handler to delete a category (and safely update existing assets of this category to fallback category)
  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      showToast(idt("អ្នកត្រូវតែរក្សាទុកយ៉ាងហោចណាស់ប្រភេទមួយ!", "You must keep at least one category!", "您必须至少保留一个类别！"), "error");
      return;
    }

    const fallbackCat = categories.filter(c => c !== catToDelete)[0];

    setDeleteConfirm({
      type: "category",
      targetId: catToDelete,
      nameKh: catToDelete,
      nameEn: catToDelete,
      messageKh: `តើអ្នកពិតជាចង់លុបប្រភេទ "${catToDelete}" មែនទេ? សម្ភារៈទាំងអស់នៅក្នុងប្រភេទនេះនឹងត្រូវប្តូរទៅជាប្រភេទ "${fallbackCat}"។`,
      messageEn: `Are you sure you want to delete category "${catToDelete}"? All assets in this category will be moved to "${fallbackCat}".`,
      onConfirm: () => {
        const remainingCats = categories.filter(c => c !== catToDelete);

        // Update assets
        setAssets(prev => prev.map(item => {
          if (item.category === catToDelete) {
            return { ...item, category: fallbackCat };
          }
          return item;
        }));

        // Update filters and forms
        if (selectedCategory === catToDelete) {
          setSelectedCategory("ទាំងអស់ (All)");
        }
        if (formCategory === catToDelete) {
          setFormCategory(fallbackCat);
        }

        setCategories(remainingCats);
        showToast(idt("បានលុបប្រភេទសម្ភារៈជោគជ័យ!", "Successfully deleted category!", "成功删除类别！"), "success");
        setDeleteConfirm(null);
      }
    });
  };

  // Handler to add a new status
  const handleAddStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newStatusName.trim();
    if (!trimmed) {
      showToast(idt("សូមបញ្ចូលឈ្មោះស្ថានភាពថ្មី!", "Please enter a status name!", "请输入状态名称！"), "error");
      return;
    }
    if (statuses.includes(trimmed)) {
      showToast(idt("ស្ថានភាពនេះមានរួចហើយ!", "This status already exists!", "此状态已存在！"), "error");
      return;
    }

    setStatuses(prev => [...prev, trimmed]);
    setNewStatusName("");
    showToast(idt("បានបន្ថែមស្ថានភាពថ្មីជោគជ័យ!", "Successfully added new status!", "成功添加新状态！"), "success");
  };

  // Handler to update a status (and update all matching assets and current filter/form choices)
  const handleEditStatus = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      showToast(idt("ឈ្មោះស្ថានភាពមិនអាចទទេបានទេ!", "Status name cannot be empty!", "状态名称不能为空！"), "error");
      return;
    }
    if (trimmed === oldName) {
      setEditingStatusIndex(null);
      return;
    }
    if (statuses.includes(trimmed)) {
      showToast(idt("ស្ថានភាពនេះមានរួចហើយ!", "This status already exists!", "此状态已存在！"), "error");
      return;
    }

    // Update statuses
    setStatuses(prev => prev.map(s => s === oldName ? trimmed : s));

    // Cascade update assets
    setAssets(prev => prev.map(item => {
      if (item.status === oldName) {
        return { ...item, status: trimmed };
      }
      return item;
    }));

    // Cascade update selection values
    if (statusFilter === oldName) {
      setStatusFilter(trimmed);
    }
    if (formStatus === oldName) {
      setFormStatus(trimmed);
    }

    setEditingStatusIndex(null);
    showToast(idt("បានកែប្រែស្ថានភាពជោគជ័យ!", "Successfully updated status!", "成功更新状态！"), "success");
  };

  // Handler to delete a status (and safely update existing assets of this status to fallback status)
  const handleDeleteStatus = (statusToDelete: string) => {
    if (statuses.length <= 1) {
      showToast(idt("អ្នកត្រូវតែរក្សាទុកយ៉ាងហោចណាស់ស្ថានភាពមួយ!", "You must keep at least one status!", "您必须至少保留一个状态！"), "error");
      return;
    }

    const fallbackStatus = statuses.filter(s => s !== statusToDelete)[0];

    setDeleteConfirm({
      type: "status",
      targetId: statusToDelete,
      nameKh: statusToDelete,
      nameEn: statusToDelete,
      messageKh: `តើអ្នកពិតជាចង់លុបស្ថានភាព "${statusToDelete}" មែនទេ? សម្ភារៈទាំងអស់នៅក្នុងស្ថានភាពនេះនឹងត្រូវប្តូរទៅជាស្ថានភាព "${fallbackStatus}"។`,
      messageEn: `Are you sure you want to delete status "${statusToDelete}"? All assets in this status will be moved to "${fallbackStatus}".`,
      onConfirm: () => {
        const remainingStats = statuses.filter(s => s !== statusToDelete);

        // Update assets
        setAssets(prev => prev.map(item => {
          if (item.status === statusToDelete) {
            return { ...item, status: fallbackStatus };
          }
          return item;
        }));

        // Update filters and forms
        if (statusFilter === statusToDelete) {
          setStatusFilter("ទាំងអស់ (All)");
        }
        if (formStatus === statusToDelete) {
          setFormStatus(fallbackStatus);
        }

        setStatuses(remainingStats);
        showToast(idt("បានលុបស្ថានភាពជោគជ័យ!", "Successfully deleted status!", "成功删除状态！"), "success");
        setDeleteConfirm(null);
      }
    });
  };

  // Helper translations
  const idt = (kh: string, en?: string, zh?: string) => {
    if (uiLang === "en") return en || kh;
    if (uiLang === "zh") return zh || en || kh;
    return kh;
  };

  const translateData = (text: string) => {
    if (uiLang === "kh") return text;
    
    const dictEn: Record<string, string> = {
      "កុំព្យូទ័រ និងបច្ចេកវិទ្យា": "Computer & Technology",
      "ឧបករណ៍មន្ទីរពិសោធន៍": "Laboratory Equipment",
      "គ្រឿងសង្ហារឹមថ្នាក់រៀន": "Classroom Furniture",
      "សៀវភៅសិក្សា និងសម្ភារៈសិក្សា": "Textbooks & Study Materials",
      "សម្ភារៈការិយាល័យ": "Office Supplies",
      "ល្អឥតខ្ចោះ": "Excellent",
      "ល្អ": "Good",
      "មធ្យម": "Fair",
      "ខូច / ត្រូវការជួសជុល": "Broken / Needs Repair",
      "បាត់បង់": "Lost",
      "ខូច/ខូចខាត": "Damaged",
      "កំពុងជួសជុល": "Repairing",
      "ទាំងអស់ (All)": "All Materials",
      "ទាំងអស់ (All Statuses)": "All Statuses",
      "បន្ទប់កុំព្យូទ័រ ១": "Computer Lab 1",
      "បន្ទប់កុំព្យូទ័រ ២": "Computer Lab 2",
      "បន្ទប់រៀន ៣០១": "Room 301",
      "បន្ទប់ម៉ាស៊ីនមេ": "Server Room",
      "ឃ្លាំងស្តុកទី២": "Storage 2",
      "បណ្ណាល័យសាលា": "School Library"
    };
    
    const dictZh: Record<string, string> = {
      "កុំព្យូទ័រ និងបច្ចេកវិទ្យា": "电脑与技术",
      "ឧបករណ៍មន្ទីរពិសោធន៍": "实验室设备",
      "គ្រឿងសង្ហារឹមថ្នាក់រៀន": "教室家具",
      "សៀវភៅសិក្សា និងសម្ភារៈសិក្សា": "教科书和学习材料",
      "សម្ភារៈការិយាល័យ": "办公用品",
      "ល្អឥតខ្ចោះ": "极好",
      "ល្អ": "良好",
      "មធ្យម": "中等",
      "ខូច / ត្រូវការជួសជុល": "损坏/需要修理",
      "បាត់បង់": "丢失",
      "ខូច/ខូចខាត": "损坏",
      "កំពុងជួសជុល": "修理中",
      "ទាំងអស់ (All)": "所有材料",
      "ទាំងអស់ (All Statuses)": "所有状态",
      "បន្ទប់កុំព្យូទ័រ ១": "计算机实验室 1",
      "បន្ទប់កុំព្យូទ័រ ២": "计算机实验室 2",
      "បន្ទប់រៀន ៣០១": "301 室",
      "បន្ទប់ម៉ាស៊ីនមេ": "服务器机房",
      "ឃ្លាំងស្តុកទី២": "二号仓库",
      "បណ្ណាល័យសាលា": "学校图书馆"
    };

    if (uiLang === "en") return dictEn[text] || text;
    if (uiLang === "zh") return dictZh[text] || dictEn[text] || text;
    return text;
  };

  // Math totals
  const totalCategoriesCount = assets.length;
  const totalQuantity = assets.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = assets.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const activeCount = assets.reduce((sum, item) => {
    if (item.status === "ល្អឥតខ្ចោះ" || item.status === "ល្អ") {
      return sum + item.quantity;
    }
    return sum;
  }, 0);
  const damagedCount = assets.reduce((sum, item) => {
    if (item.status === "ខូច/ខូចខាត" || item.status === "កំពុងជួសជុល") {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  // Filter logic
  const filteredAssets = assets.filter(item => {
    const matchesCategory = selectedCategory === "ទាំងអស់ (All)" || item.category === selectedCategory;
    const matchesStatus = statusFilter === "ទាំងអស់ (All)" || item.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (startDateFilter || endDateFilter) {
      if (item.purchaseDate) {
        if (startDateFilter && item.purchaseDate < startDateFilter) {
          matchesDate = false;
        }
        if (endDateFilter && item.purchaseDate > endDateFilter) {
          matchesDate = false;
        }
      } else {
        // If has no date but date filter is active, exclude it
        matchesDate = false;
      }
    }
    
    const term = (searchQuery || "").toLowerCase().trim();
    const matchesSearch = !term || 
      (item.nameKh || "").toLowerCase().includes(term) ||
      (item.nameEn || "").toLowerCase().includes(term) ||
      (item.id || "").toLowerCase().includes(term) ||
      (item.location || "").toLowerCase().includes(term) ||
      (item.personInCharge || "").toLowerCase().includes(term) ||
      (item.category || "").toLowerCase().includes(term);

    return matchesCategory && matchesStatus && matchesSearch && matchesDate;
  });

  // Sales filters and stats
  const filteredSales = sales.filter(item => {
    // Search match
    const sTerm = (salesSearchQuery || "").toLowerCase().trim();
    const matchesSearch = !sTerm ||
      (item.nameKh || "").toLowerCase().includes(sTerm) ||
      (item.nameEn || "").toLowerCase().includes(sTerm) ||
      (item.category || "").toLowerCase().includes(sTerm) ||
      (item.note || "").toLowerCase().includes(sTerm) ||
      (item.id || "").toLowerCase().includes(sTerm);

    // Date filter
    let matchesDate = true;
    if (salesStartDate && item.saleDate < salesStartDate) {
      matchesDate = false;
    }
    if (salesEndDate && item.saleDate > salesEndDate) {
      matchesDate = false;
    }

    return matchesSearch && matchesDate;
  });

  const totalSalesRevenue = filteredSales.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalQuantitySold = filteredSales.reduce((sum, item) => sum + item.quantitySold, 0);
  const totalUniqueItemsSold = new Set(filteredSales.map(item => item.assetId)).size;

  const openAddModal = () => {
    setFormNameKh("");
    setFormNameEn("");
    setFormDescKh("");
    setFormDescEn("");
    setFormCategory("កុំព្យូទ័រ និងបច្ចេកវិទ្យា");
    setFormQuantity(1);
    setFormUnitPrice(0);
    setFormLocation("");
    setFormPerson("");
    setFormStatus("ល្អឥតខ្ចោះ");
    setFormPurchaseDate(new Date().toISOString().split('T')[0]);
    setShowAddModal(true);
  };

  const openEditModal = (asset: Asset) => {
    setCurrentAsset(asset);
    setFormNameKh(asset.nameKh);
    setFormNameEn(asset.nameEn);
    setFormDescKh(asset.descriptionKh);
    setFormDescEn(asset.descriptionEn);
    setFormCategory(asset.category);
    setFormQuantity(asset.quantity);
    setFormUnitPrice(asset.unitPrice);
    setFormLocation(asset.location);
    setFormPerson(asset.personInCharge);
    setFormStatus(asset.status);
    setFormPurchaseDate(asset.purchaseDate || "");
    setShowEditModal(true);
  };


    const handleExportPDF = async () => {
    setIsSavingPDF(true);
    showToast(idt("កំពុងរៀបចំរក្សាទុកជា PDF... (Preparing PDF saving...)", "Preparing PDF saving...", "正在准备保存 PDF..."), "info");

    const temporaryStyleElements: HTMLStyleElement[] = [];
    const removedNodes: { node: Node; parent: Node; nextSibling: Node | null }[] = [];
    const originalAdopted = (document as any).adoptedStyleSheets;
    let restoredAdopted = false;
    const originalGetComputedStyle = window.getComputedStyle;

    try {
      const jsPDF = (await import('jspdf')).default;
                const { safeToJpeg: toJpeg } = await import('../lib/safe-html-to-image');

      // Robust helper function to extract and convert oklab/oklch colors to standard sRGB format
      const extractAndConvert = (funcType: string, inner: string): string => {
        const normalized = inner.replace(/,/g, ' ');
        const parts = normalized.trim().split(/\s+/);
        if (parts.length === 0) return "rgb(100, 116, 139)";
        
        let lStr = parts[0];
        let lVal = parseFloat(lStr);
        if (lStr.endsWith('%')) {
          lVal = parseFloat(lStr) / 100;
        }
        
        if (isNaN(lVal)) {
          return "rgb(100, 116, 139)";
        }
        
        let alpha = 1;
        const slashIndex = parts.indexOf('/');
        if (slashIndex !== -1 && slashIndex + 1 < parts.length) {
          alpha = parseFloat(parts[slashIndex + 1]);
        } else {
          const partWithSlash = parts.find(p => p.startsWith('/'));
          if (partWithSlash) {
            alpha = parseFloat(partWithSlash.substring(1));
          }
        }
        if (isNaN(alpha)) alpha = 1;

        if (lVal >= 0.96) {
          return alpha < 1 ? `rgba(255, 255, 255, ${alpha})` : "rgb(255, 255, 255)";
        }
        if (lVal <= 0.05) {
          return alpha < 1 ? `rgba(0, 0, 0, ${alpha})` : "rgb(0, 0, 0)";
        }
        
        try {
          if (funcType === 'oklab') {
            let aVal = parts[1] ? parseFloat(parts[1]) : 0;
            let bVal = parts[2] ? parseFloat(parts[2]) : 0;
            if (isNaN(aVal)) aVal = 0;
            if (isNaN(bVal)) bVal = 0;
            
            const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
            const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
            const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
            
            const l = l_ * l_ * l_;
            const m = m_ * m_ * m_;
            const s = s_ * s_ * s_;
            
            const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
            const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
            const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
            
            const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
            const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
            const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
            const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
            
            return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
          } else {
            let cVal = parts[1] ? parseFloat(parts[1]) : 0;
            let hVal = parts[2] ? parseFloat(parts[2]) : 0;
            if (isNaN(cVal)) cVal = 0;
            if (isNaN(hVal)) hVal = 0;
            
            const hRad = (hVal * Math.PI) / 180;
            const aVal = cVal * Math.cos(hRad);
            const bVal = cVal * Math.sin(hRad);
            
            const l_ = lVal + 0.3963377774 * aVal + 0.2158037573 * bVal;
            const m_ = lVal - 0.1055613458 * aVal - 0.0638541728 * bVal;
            const s_ = lVal - 0.0894841775 * aVal - 1.2914855414 * bVal;
            
            const l = l_ * l_ * l_;
            const m = m_ * m_ * m_;
            const s = s_ * s_ * s_;
            
            const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
            const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
            const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
            
            const f = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
            const R = Math.round(Math.max(0, Math.min(1, f(r))) * 255);
            const G = Math.round(Math.max(0, Math.min(1, f(g))) * 255);
            const B = Math.round(Math.max(0, Math.min(1, f(b))) * 255);
            
            return alpha < 1 ? `rgba(${R}, ${G}, ${B}, ${alpha})` : `rgb(${R}, ${G}, ${B})`;
          }
        } catch (e) {
          return "rgb(100, 116, 139)";
        }
      };

      const sanitizeCssColors = (css: string): string => {
        let result = "";
        let i = 0;
        while (i < css.length) {
          const sub6 = css.substring(i, i + 6).toLowerCase();
          if (sub6 === "oklch(" || sub6 === "oklab(") {
            const funcType = sub6.slice(0, 5);
            i += 6;
            const start = i;
            let depth = 1;
            while (i < css.length && depth > 0) {
              if (css[i] === '(') {
                depth++;
              } else if (css[i] === ')') {
                depth--;
              }
              i++;
            }
            const inner = css.substring(start, i - 1);
            result += extractAndConvert(funcType, inner);
          } else {
            result += css[i];
            i++;
          }
        }
        return result;
      };

      // Intercept window.getComputedStyle to dynamically replace oklch/oklab values during image generation
      window.getComputedStyle = function(el, pseudoElt) {
        const style = originalGetComputedStyle(el, pseudoElt);
        return new Proxy(style, {
          get(target, prop, receiver) {
            if (prop === 'getPropertyValue') {
              return function(propertyName: string) {
                const val = target.getPropertyValue(propertyName);
                if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
                  return sanitizeCssColors(val);
                }
                return val;
              };
            }
            const val = Reflect.get(target, prop, target);
            if (typeof val === 'string' && (val.includes('oklab(') || val.includes('oklch('))) {
              return sanitizeCssColors(val);
            }
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          }
        }) as any;
      };

      // Disable adoptedStyleSheets dynamically to force fallback to standard stylesheets
      if (originalAdopted && originalAdopted.length > 0) {
        try {
          (document as any).adoptedStyleSheets = [];
          restoredAdopted = true;
        } catch (e) {
          console.warn("Failed to temporarily clear adoptedStyleSheets:", e);
        }
      }

      // Sanitize document stylesheets to replace "oklch" and "oklab" color functions
      try {
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            if (sheet.cssRules) {
              const rules = Array.from(sheet.cssRules);
              const needsSanitization = rules.some(r => r.cssText.includes("oklch") || r.cssText.includes("oklab"));
              if (needsSanitization) {
                const cssText = rules.map(r => r.cssText).join("\n");
                const sanitizedText = sanitizeCssColors(cssText);

                // Create a temporary style element with sanitized CSS
                const tempStyle = document.createElement("style");
                tempStyle.setAttribute("data-temp-sanitized-style", "true");
                tempStyle.textContent = sanitizedText;
                document.head.appendChild(tempStyle);
                temporaryStyleElements.push(tempStyle);

                // Physically remove the original sheet's ownerNode from DOM
                if (sheet.ownerNode && sheet.ownerNode.parentNode) {
                  const node = sheet.ownerNode;
                  const parent = node.parentNode;
                  const nextSibling = node.nextSibling;
                  removedNodes.push({ node, parent, nextSibling });
                  parent.removeChild(node);
                }
              }
            }
          } catch (sheetErr) {
            // CORS stylesheet fetch fallback
            const node = sheet.ownerNode;
            let fetchedAndSanitized = false;
            if (node && node.nodeName === "LINK") {
              const linkEl = node as HTMLLinkElement;
              if (linkEl.href) {
                try {
                  const response = await fetch(linkEl.href);
                  if (response.ok) {
                    const rawText = await response.text();
                    const sanitizedText = sanitizeCssColors(rawText);
                    const tempStyle = document.createElement("style");
                    tempStyle.setAttribute("data-temp-sanitized-style", "true");
                    tempStyle.textContent = sanitizedText;
                    document.head.appendChild(tempStyle);
                    temporaryStyleElements.push(tempStyle);

                    if (linkEl.parentNode) {
                      const parent = linkEl.parentNode;
                      const nextSibling = linkEl.nextSibling;
                      removedNodes.push({ node: linkEl, parent, nextSibling });
                      parent.removeChild(linkEl);
                      fetchedAndSanitized = true;
                    }
                  }
                } catch (fetchErr) {
                  console.warn("Could not fetch CORS stylesheet:", linkEl.href, fetchErr);
                }
              }
            }
            if (!fetchedAndSanitized) {
              console.log("Temporarily removed unreadable CORS stylesheet to prevent html2canvas crash:", node);
              if (node && node.parentNode) {
                const parent = node.parentNode;
                const nextSibling = node.nextSibling;
                removedNodes.push({ node, parent, nextSibling });
                parent.removeChild(node);
              }
            }
          }
        }
      } catch (styleSanitizeErr) {
        console.warn("Stylesheet sanitization failed, proceeding anyway:", styleSanitizeErr);
      }

      const element = document.getElementById("print-section");
      if (!element) {
        showToast("Print section not found. Please try again.", "error");
        setIsSavingPDF(false);
        return;
      }

      // 1. Clone the element to prevent modifying the active UI
      const clone = element.cloneNode(true) as HTMLElement;

      // 2. Remove all elements with the 'no-print' class (like Actions header & cells, buttons, icons, etc.)
      clone.querySelectorAll(".no-print").forEach((el) => el.remove());
      
      // Remove text clipping classes for better font rendering in print
      clone.querySelectorAll(".line-clamp-1, .truncate").forEach((el) => {
        el.classList.remove("line-clamp-1");
        el.classList.remove("truncate");
      });

      // 3. Remove the hidden print header to match screenshot
      const printHeader = clone.querySelector(".hidden.print\\:flex, .print\\:flex");
      if (printHeader) {
        printHeader.remove();
      }

      // 4. Remove responsive overflow wrapper and hidden overflow to allow full table width rendering
      const tableWrapper = clone.querySelector(".overflow-x-auto");
      if (tableWrapper) {
        tableWrapper.classList.remove("overflow-x-auto");
      }
      clone.classList.remove("overflow-hidden");

      // Apply table borders and tweaks for PDF export
      const table = clone.querySelector("table");
      if (table) {
        table.classList.remove("border-collapse", "min-w-[980px]");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.style.border = "none";
      }
      
      // Clean up body classes that cause double borders
      const tbody = clone.querySelector("tbody");
      if (tbody) {
        tbody.classList.remove("divide-y", "divide-slate-100");
      }
      
      const theadTr = clone.querySelector("thead tr");
      if (theadTr) {
        theadTr.classList.remove("border-b", "border-slate-100", "bg-slate-50/50");
      }

      clone.querySelectorAll("tr").forEach((row) => {
        // Handle headers
        const ths = row.querySelectorAll("th");
        ths.forEach((th, index) => {
          const hEl = th as HTMLElement;
          hEl.style.border = "1px solid #000000";
          hEl.style.padding = "6px 8px";
          hEl.style.backgroundColor = "#ffffff";
          hEl.style.color = "#000000";
          hEl.style.fontWeight = "bold";
          hEl.style.fontSize = "11px";
          hEl.style.textAlign = "center";
          
          // Remove English text from header if it exists
          if (hEl.innerText.includes(" / ")) {
            hEl.innerText = hEl.innerText.split(" / ")[0];
          } else if (hEl.innerText === "ID") {
            hEl.innerText = viewMode === "sales" ? "លេខកូដលក់" : "លេខកូដ";
          }
          
          // Match screenshot header names
          if (hEl.innerText === "ឈ្មោះសម្ភារៈសិក្សា") hEl.innerText = "ឈ្មោះសម្ភារៈ";
          if (hEl.innerText === "តម្លៃឯកតា") hEl.innerText = "តម្លៃរាយ";
        });
        
        // Handle body cells
        const tds = row.querySelectorAll("td");
        tds.forEach((td, index) => {
          const hEl = td as HTMLElement;
          hEl.style.border = "1px solid #000000";
          hEl.style.padding = "6px 8px";
          hEl.style.lineHeight = "1.5";
          hEl.style.color = "#000000";
          hEl.style.fontSize = "11px";
          
          if (viewMode === "sales") {
            // 0: ID (center), 1: Name (left), 2: Category (left), 3: Qty (center), 4: Unit Price (right), 5: Total Revenue (right), 6: Sale Date (center), 7: Notes (left)
            if (index === 0 || index === 3 || index === 6) {
              hEl.style.textAlign = "center";
            } else if (index === 4 || index === 5) {
              hEl.style.textAlign = "right";
            } else {
              hEl.style.textAlign = "left";
            }
          } else {
            // Apply alignments based on column index matching the screenshot
            // 0: ID (center), 1: Name (left), 2: Category (left), 3: Qty (center), 4: Unit Price (right), 5: Total (right), 6: Location (left), 7: In charge (left), 8: Date (center), 9: Status (center)
            if (index === 0 || index === 3 || index === 8 || index === 9) {
              hEl.style.textAlign = "center";
            } else if (index === 4 || index === 5) {
              hEl.style.textAlign = "right";
            } else {
              hEl.style.textAlign = "left";
            }
          }
          
          // Clean up pill badges and subtiles inside cells
          const spans = hEl.querySelectorAll("span");
          if (spans.length > 1) {
            // Remove the english subtitle (second span)
            spans[1].remove();
          }
          
          spans.forEach(span => {
            (span as HTMLElement).style.backgroundColor = "transparent";
            (span as HTMLElement).style.border = "none";
            (span as HTMLElement).style.padding = "0";
            (span as HTMLElement).style.color = "#000000";
            (span as HTMLElement).style.fontWeight = "normal";
          });
        });
      });

      // Hide original summary
      const originalFooter = clone.querySelector(".border-t.border-slate-100");
      if (originalFooter) {
        originalFooter.remove();
      }

      // Add Footer row for totals matching screenshot
      if (table) {
        let totalItems, totalValue, itemsText;
        if (viewMode === "sales") {
           totalItems = filteredSales.length;
           totalValue = totalSalesRevenue;
           itemsText = `បង្ហាញកំណត់ត្រាលក់ចេញសរុប ${toKhmerNumber(totalItems)} លើក`;
        } else {
           totalItems = filteredAssets.length;
           totalValue = filteredAssets.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
           itemsText = `បង្ហាញទិន្នន័យសរុប ${toKhmerNumber(totalItems)} មុខ`;
        }
        
        const tfoot = document.createElement("tfoot");
        const tr = document.createElement("tr");
        
        const tdLeft = document.createElement("td");
        tdLeft.colSpan = 5;
        tdLeft.style.padding = "10px 8px";
        tdLeft.style.fontSize = "11px";
        tdLeft.style.fontWeight = "bold";
        tdLeft.style.color = "#000000";
        tdLeft.style.border = "none";
        tdLeft.style.textAlign = "left";
        tdLeft.innerText = itemsText;
        
        const tdValue = document.createElement("td");
        tdValue.colSpan = 1;
        tdValue.style.padding = "10px 8px";
        tdValue.style.fontSize = "11px";
        tdValue.style.fontWeight = "bold";
        tdValue.style.color = "#000000";
        tdValue.style.border = "none";
        tdValue.style.textAlign = "right";
        tdValue.innerText = `${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        const tdEmpty = document.createElement("td");
        tdEmpty.colSpan = viewMode === "sales" ? 2 : 4;
        tdEmpty.style.border = "none";
        tdEmpty.style.backgroundColor = "transparent";
        
        tr.appendChild(tdLeft);
        tr.appendChild(tdValue);
        tr.appendChild(tdEmpty);
        tfoot.appendChild(tr);
        table.appendChild(tfoot);
      }

      clone.querySelectorAll("span, div").forEach((el) => {
        (el as HTMLElement).style.lineHeight = "1.6";
        (el as HTMLElement).style.overflow = "visible";
      });

      // 5. Apply high-precision print layout styles
      clone.style.width = "1123px"; 
      clone.style.minWidth = "1123px";
      clone.style.maxWidth = "1123px";
      clone.style.padding = "24px";
      clone.style.margin = "0 auto";
      clone.style.backgroundColor = "#ffffff";
      clone.style.borderRadius = "0px";
      clone.style.boxShadow = "none";
      clone.style.border = "none";

      // 6. Append to a hidden offscreen container to avoid scrolling/viewport issues
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "0px";
      tempContainer.style.top = "0px";
      tempContainer.style.width = "1123px";
      tempContainer.style.opacity = "0";
      tempContainer.style.pointerEvents = "none";
      tempContainer.style.zIndex = "-1000";
      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);

      const opt = {
        margin: [5, 5, 5, 5] as [number, number, number, number], // top, left, bottom, right in mm
        filename: viewMode === "sales" 
          ? `PLC_Sales_Report_${new Date().toLocaleDateString('en-GB').replace(/\//g, '_')}.pdf`
          : `PLC_Inventory_Assets_${new Date().toLocaleDateString('en-GB').replace(/\//g, '_')}.pdf`,
        image: { type: 'jpeg' as 'jpeg', quality: 1.0 },
        html2canvas: { 
          ...({ scale: 2 } as any), 
          useCORS: true,
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1123,
          backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
      };

      // 7. Generate PDF
      document.body.appendChild(clone);
                                const imgData = await toJpeg(clone, { quality: 0.98, backgroundColor: "#ffffff", pixelRatio: 2 });
                                document.body.removeChild(clone);
                                const pdf = new jsPDF({
                                    orientation: opt.jsPDF?.orientation || 'portrait',
                                    unit: 'in',
                                    format: 'a4'
                                });
                                const pdfWidth = pdf.internal.pageSize.getWidth();
                                const img = new Image();
                                img.src = imgData;
                                await new Promise(resolve => { img.onload = resolve; });
                                const pdfHeight = (img.height * pdfWidth) / img.width;
                                pdf.addImage(imgData, 'JPEG', 0.5, 0.5, pdfWidth - 1, pdfHeight - 1);
                                pdf.save(opt.filename || 'export.pdf');
      
      // 8. Clean up offscreen elements
      document.body.removeChild(tempContainer);

      showToast(idt("បានរក្សាទុកឯកសារ PDF ដោយជោគជ័យ!", "PDF Saved Successfully!", "PDF 保存成功！"), "success");
    } catch (error) {
      console.error(error);
      showToast(idt("ការបង្កើត PDF បរាជ័យ កំពុងប្តូរទៅកាន់ការបោះពុម្ពជំនួសវិញ...", "PDF generation failed, falling back to print...", "PDF 生成失败，正在切换至打印..."), "error");
      window.print();
    } finally {
      setIsSavingPDF(false);
      // Restore elements and custom style rules
      try {
        removedNodes.forEach(({ node, parent, nextSibling }) => {
          try {
            if (nextSibling) {
              parent.insertBefore(node, nextSibling);
            } else {
              parent.appendChild(node);
            }
          } catch (restoreNodeErr) {
            console.warn("Failed to restore node:", restoreNodeErr);
          }
        });
        temporaryStyleElements.forEach((tempStyle) => {
          if (tempStyle.parentNode) {
            tempStyle.parentNode.removeChild(tempStyle);
          }
        });
        if (restoredAdopted && originalAdopted) {
          (document as any).adoptedStyleSheets = originalAdopted;
        }
        if (originalGetComputedStyle) {
          window.getComputedStyle = originalGetComputedStyle;
        }
      } catch (restoreErr) {
        console.error("Style restoration failed:", restoreErr);
      }
    }
  };

  const openSellModal = (asset?: Asset) => {
    let targetAsset = asset || null;
    if (!targetAsset) {
      targetAsset = assets.find(a => a.quantity > 0) || null;
    }
    if (!targetAsset && assets.length > 0) {
      targetAsset = assets[0];
    }
    if (!targetAsset) {
      alert(idt("មិនមានសម្ភារៈសម្រាប់លក់ទេ", "No assets available to sell", "没有可供出售的资产"));
      return;
    }

    setSellAsset(targetAsset);
    setSellQuantity(1);
    setSellPrice(targetAsset.unitPrice);
    setSellDate(new Date().toISOString().split('T')[0]);
    setSellNote("");
    setShowSellModal(true);
  };

  const openEditSaleModal = (sale: AssetSale) => {
    setEditSaleTarget(sale);
    setEditSaleQuantity(sale.quantitySold);
    setEditSalePrice(sale.pricePerUnit);
    setEditSaleDate(sale.saleDate);
    setEditSaleNote(sale.note || "");
    setShowEditSaleModal(true);
  };

  const handleUndoSale = (saleId: string) => {
    setDeleteConfirm({
      isOpen: true,
      title: idt("លុបកំណត់ត្រាលក់", "Delete Sale Record", "删除销售记录"),
      message: idt("តើអ្នកប្រាកដជាចង់លុបកំណត់ត្រាលក់នេះមែនទេ? បរិមាណនឹងត្រូវបានបូកបញ្ចូលទៅក្នុងស្តុកវិញ។", "Are you sure you want to delete this sale record? The quantity will be restored to inventory.", "您确定要删除此销售记录吗？数量将恢复到库存中。"),
      onConfirm: async () => {
        try {
          const sale = sales.find(s => s.id === saleId);
          if (sale) {
            setAssets(prev => prev.map(a => 
              a.id === sale.assetId 
                ? { ...a, quantity: a.quantity + sale.quantitySold }
                : a
            ));
            setSales(prev => prev.filter(s => s.id !== saleId));
            showToast(idt("បានលុបកំណត់ត្រាលក់ដោយជោគជ័យ!", "Sale record deleted successfully!", "销售记录已成功删除！"), "success");
          }
        } catch (error) {
          showToast(idt("មានបញ្ហាក្នុងការលុបកំណត់ត្រា", "Error deleting record", "删除记录时出错"), "error");
        } finally {
          setDeleteConfirm({ isOpen: false, title: "", message: "", onConfirm: () => {} });
        }
      }
    });
  };

  const handleDeleteAsset = (asset: Asset) => {
    setDeleteConfirm({
      isOpen: true,
      title: idt("លុបសម្ភារៈ", "Delete Asset", "删除资产"),
      message: idt(`តើអ្នកប្រាកដជាចង់លុប ${asset.nameKh} មែនទេ?`, `Are you sure you want to delete ${asset.nameEn}?`, `您确定要删除 ${asset.nameEn} 吗？`),
      onConfirm: async () => {
        setAssets(prev => prev.filter(a => a.id !== asset.id));
        setDeleteConfirm({ isOpen: false, title: "", message: "", onConfirm: () => {} });
        showToast(idt("បានលុបសម្ភារៈដោយជោគជ័យ!", "Asset deleted successfully!", "资产已成功删除！"), "success");
      }
    });
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: Asset = {
      id: "AST-" + Date.now(),
      nameKh: formNameKh,
      nameEn: formNameEn,
      descriptionKh: formDescKh,
      descriptionEn: formDescEn,
      category: formCategory,
      quantity: formQuantity,
      unitPrice: formUnitPrice,
      location: formLocation,
      personInCharge: formPerson,
      status: formStatus,
      purchaseDate: formPurchaseDate
    };
    setAssets(prev => [newAsset, ...prev]);
    setShowAddModal(false);
    showToast(idt("បានបន្ថែមសម្ភារៈថ្មីដោយជោគជ័យ!", "New asset added successfully!", "新资产添加成功！"), "success");
  };

  const handleEditAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset) return;
    const updatedAsset: Asset = {
      ...currentAsset,
      nameKh: formNameKh,
      nameEn: formNameEn,
      descriptionKh: formDescKh,
      descriptionEn: formDescEn,
      category: formCategory,
      quantity: formQuantity,
      unitPrice: formUnitPrice,
      location: formLocation,
      personInCharge: formPerson,
      status: formStatus,
      purchaseDate: formPurchaseDate
    };
    setAssets(prev => prev.map(a => a.id === currentAsset.id ? updatedAsset : a));
    setShowEditModal(false);
    showToast(idt("បានកែប្រែសម្ភារៈដោយជោគជ័យ!", "Asset updated successfully!", "资产更新成功！"), "success");
  };

  const handleSellAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellAsset || sellQuantity <= 0 || sellQuantity > sellAsset.quantity) {
       showToast("បរិមាណមិនត្រឹមត្រូវ", "error");
       return;
    }
    
    const newSale: AssetSale = {
      id: "SL-" + Date.now(),
      assetId: sellAsset.id,
      nameKh: sellAsset.nameKh,
      nameEn: sellAsset.nameEn,
      category: sellAsset.category,
      quantitySold: sellQuantity,
      pricePerUnit: sellPrice,
      totalRevenue: sellQuantity * sellPrice,
      saleDate: sellDate,
      note: sellNote,
    };
    
    setAssets(prev => prev.map(a => 
      a.id === sellAsset.id 
        ? { ...a, quantity: a.quantity - sellQuantity }
        : a
    ));
    setSales(prev => [newSale, ...prev]);
    setShowSellModal(false);
    showToast(idt("បានរក្សាទុកកំណត់ត្រាលក់ជោគជ័យ!", "Sale record saved successfully!", "销售记录保存成功！"), "success");
  };

  const handleEditSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSaleTarget) return;
    
    const asset = assets.find(a => a.id === editSaleTarget.assetId);
    if (!asset) return;
    
    const qtyDiff = editSaleTarget.quantitySold - editSaleQuantity;
    if (asset.quantity + qtyDiff < 0) {
       showToast("បរិមាណមិនត្រឹមត្រូវ ស្តុកមិនគ្រប់គ្រាន់", "error");
       return;
    }
    
    const updatedSale: AssetSale = {
      ...editSaleTarget,
      quantitySold: editSaleQuantity,
      pricePerUnit: editSalePrice,
      totalRevenue: editSaleQuantity * editSalePrice,
      saleDate: editSaleDate,
      note: editSaleNote
    };
    
    setAssets(prev => prev.map(a => 
      a.id === editSaleTarget.assetId 
        ? { ...a, quantity: a.quantity + qtyDiff }
        : a
    ));
    
    setSales(prev => prev.map(s => s.id === editSaleTarget.id ? updatedSale : s));
    setShowEditSaleModal(false);
    showToast(idt("បានកែប្រែកំណត់ត្រាលក់ជោគជ័យ!", "Sale record updated successfully!", "销售记录更新成功！"), "success");
  };

  const handleExportCSV = () => {
    if (viewMode === "sales") {
      if (filteredSales.length === 0) return;
      const data = filteredSales.map((row, idx) => ({
        "លេខកូដលក់": "SL-" + String(filteredSales.length - idx).padStart(3, '0'),
        "កាលបរិច្ឆេទលក់": new Date(row.saleDate).toLocaleDateString('en-GB'),
        "ឈ្មោះសម្ភារៈ": row.nameKh,
        "ឈ្មោះសម្ភារៈ (អង់គ្លេស)": row.nameEn || "-",
        "ប្រភេទ": row.category,
        "ចំនួនលក់": row.quantitySold,
        "តម្លៃលក់រាយ": `${row.pricePerUnit.toFixed(2)}`,
        "ចំណូលសរុប": `${row.totalRevenue.toFixed(2)}`,
        "កំណត់សម្គាល់": row.note || "-"
      }));
      exportToExcel(data, `Sales_Report_${new Date().toISOString().split('T')[0]}`, "របាយការណ៍លក់ចេញជាក់ស្ដែង (Sales Output Report)");
    } else {
      if (filteredAssets.length === 0) return;
      
      const data = filteredAssets.map(row => ({
        "លេខកូដ": row.id,
        "ឈ្មោះសម្ភារៈ": row.nameKh,
        "ប្រភេទ": row.category,
        "ចំនួន": row.quantity,
        "តម្លៃរាយ": `${row.unitPrice.toFixed(2)}`,
        "តម្លៃសរុប": `${(row.quantity * row.unitPrice).toFixed(2)}`,
        "ទីតាំង": row.location || "-",
        "អ្នកកាន់កាប់": row.personInCharge || "-",
        "កាលបរិច្ឆេទ": row.purchaseDate || "-",
        "ស្ថានភាព": row.status || "-"
      }));
      
      exportToExcel(data, `Assets_Report_${new Date().toISOString().split('T')[0]}`, "បញ្ជីសារពើភ័ណ្ឌគ្រប់គ្រងសម្ភារៈសិក្សា និងឧបករណ៍ (Assets Inventory Report)");
    }
  };

  return (
        <div
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-primary-600" />
            {idt("គ្រប់គ្រងសម្ភារៈសិក្សា និងឧបករណ៍", "Study Materials & Assets Management", "学习材料及资产管理")}
          </h2>
          <p className="text-xs sm:text-xs text-slate-500 mt-1">
            {idt("បញ្ជីគ្រប់គ្រង និងតាមដានស្ថានភាព សម្ភារៈឧបទេស សៀវភៅ និងឧបករណ៍បច្ចេកវិទ្យាសម្រាប់ថ្នាក់រៀន", "Inventory register to monitor, track and maintain educational materials, books, and technological tools across classrooms.", "用于监控、跟踪和维护整个教室的教育材料、书籍和技术工具的清单记录。")}
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <button
            onClick={handleExportPDF}
            disabled={isSavingPDF}
            className={`px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-200 flex items-center gap-2 ${isSavingPDF ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isSavingPDF ? (
               <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
            ) : (
               <Printer className="w-4 h-4 stroke-[2.5]" />
            )}
            <span className="hidden sm:inline-block">{isSavingPDF ? idt("កំពុងរក្សាទុក...", "Saving...", "保存中...") : idt("រក្សាទុកជា PDF", "Save as PDF", "保存为 PDF")}</span>
          </button>
          
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline-block">{idt("ទាញយក Google Sheet", "Download Google Sheet", "下载 Google Sheet")}</span>
          </button>

          {viewMode === "inventory" && (
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/15"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{idt("បន្ថែមសម្ភារៈថ្មី", "Add New Asset", "添加新资产")}</span>
            </button>
          )}
          {viewMode === "sales" && (
            <button
              onClick={() => openSellModal()}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-extrabold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md shadow-primary-600/10 hover:shadow-lg hover:shadow-primary-600/15"
            >
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
              <span>{idt("កត់ត្រាលក់ចេញ", "Record Sale", "记录销售")}</span>
            </button>
          )}
        </div>
      </div>

      {/* View Segment Switcher Tabs */}
      <div className="flex border-b border-slate-200 no-print pb-px gap-1">
        <button
          onClick={() => setViewMode("inventory")}
          className={`pb-3 px-6 text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-2 border-b-2 ${
            viewMode === "inventory"
              ? "border-primary-600 text-primary-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{idt("បញ្ជីសារពើភ័ណ្ឌ", "Inventory Register", "资产清单")}</span>
        </button>
        <button
          onClick={() => setViewMode("sales")}
          className={`pb-3 px-6 text-xs font-black uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-2 border-b-2 ${
            viewMode === "sales"
              ? "border-primary-600 text-primary-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{idt("កំណត់ត្រាលក់ចេញ", "Sales History", "销售记录")}</span>
        </button>
      </div>

      {viewMode === "inventory" && (
        <>
          {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        {/* Total Categories */}
        <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-primary-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary-500"></div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
          <div className="relative z-10 space-y-1.5 pr-2">
            <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
              {idt("ចំនួនសម្ភារៈសរុប", "Total Items Listed", "总资产类型")}
            </p>
            <div className="flex items-end gap-3 mb-2.5">
              <p className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight leading-none">
                {idt(`${toKhmerNumber(totalCategoriesCount)}`, `${totalCategoriesCount}`)} <span className="text-lg lg:text-xl font-bold">{idt("មុខ", "Types", "种类")}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-primary-700/90">{idt("សរុបទាំងអស់ (All Types)", "All listed asset types", "所有列出的资产类型")}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 border border-primary-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:rotate-3 group-hover:shadow-md">
            <Package className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-emerald-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
          <div className="relative z-10 space-y-1.5 pr-2">
            <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
              {idt("តម្លៃសរុប", "Total Valuation", "总估值")}
            </p>
            <div className="flex items-end gap-3 mb-2.5">
              <p className="text-2xl lg:text-3xl font-black text-emerald-600 font-mono tracking-tight leading-none">
                {uiLang === "kh" ? formatKhmerPrice(totalValue) : `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-emerald-750">{idt("គិតជាដុល្លារអាមេរិក (USD)", "Valuation in USD", "以美元计价")}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:rotate-3 group-hover:shadow-md">
            <DollarSign className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Normal Equipment */}
        <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-blue-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500"></div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
          <div className="relative z-10 space-y-1.5 pr-2">
            <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
              {idt("ឧបករណ៍ប្រើប្រាស់បានធម្មតា", "Normal In-Use Tools", "正常使用工具")}
            </p>
            <div className="flex items-end gap-3 mb-2.5">
              <p className="text-2xl lg:text-3xl font-black text-blue-600 tracking-tight leading-none">
                {idt(`${toKhmerNumber(activeCount)}`, `${activeCount}`)} <span className="text-lg lg:text-xl font-bold">{idt("គ្រឿង", "Units", "件")}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-blue-700/90">{idt("អាចប្រើការបាន (Functional)", "In good condition", "状况良好")}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:rotate-3 group-hover:shadow-md">
            <CheckCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Broken / repairing */}
        <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-rose-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500"></div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
          <div className="relative z-10 space-y-1.5 pr-2">
            <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
              {idt("សម្ភារៈខូច / កំពុងជួសជុល", "Broken / Under Repair", "损坏 / 维修中")}
            </p>
            <div className="flex items-end gap-3 mb-2.5">
              <p className="text-2xl lg:text-3xl font-black text-rose-600 tracking-tight leading-none">
                {idt(`${toKhmerNumber(damagedCount)}`, `${damagedCount}`)} <span className="text-lg lg:text-xl font-bold">{idt("គ្រឿង", "Units", "件")}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-rose-700/90">{idt("ត្រូវការយកចិត្តទុកដាក់ (Needs Repair)", "Requires attention", "需要注意")}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 group-hover:rotate-3 group-hover:shadow-md">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* Pill buttons for filtering by category */}
      <div className="flex flex-row items-center gap-2 pt-1 pb-2 overflow-x-auto scrollbar-none w-full no-print">
        {["ទាំងអស់ (All)", ...categories].map((cat, i) => {
          const isSelected = selectedCategory === cat;
          const displayLabel = translateData(cat);
          return (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 whitespace-nowrap px-4.5 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                isSelected 
                  ? "bg-slate-900 text-white shadow-xs" 
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {displayLabel}
            </button>
          );
        })}

        {/* Manage Categories Button next to the pills */}
        <button
          onClick={() => setShowManageCategories(true)}
          className="shrink-0 whitespace-nowrap px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 hover:text-primary-700 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer border border-primary-100 transition-all shadow-3xs"
          title={idt("គ្រប់គ្រងប្រភេទសម្ភារៈ", "Manage Categories", "管理类别")}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{idt("គ្រប់គ្រងប្រភេទ", "Manage Categories", "管理类别")}</span>
        </button>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 no-print">
        {/* Search input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={idt("ស្វែងរកឈ្មោះ លេខសម្គាល់ ទីតាំង អ្នកកាន់កាប់...", "Search by name, ID, location, handler...", "按名称、编号、位置、负责人搜索...")}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary-400 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-3xs"
          />
        </div>

        {/* Date search input */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider px-2 shrink-0">
            {idt("កាលបរិច្ឆេទ ៖", "Date:", "日期:")}
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-250 focus:border-primary-400 focus:bg-white rounded-xl text-xs font-bold focus:outline-none transition-all text-slate-700 shadow-3xs cursor-pointer"
              title={idt("កាលបរិច្ឆេទចាប់ផ្តើម", "Start Date", "开始日期")}
            />
            <span className="text-xs text-slate-400 font-bold">{idt("ដល់", "to", "至")}</span>
            <input
              type="date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-250 focus:border-primary-400 focus:bg-white rounded-xl text-xs font-bold focus:outline-none transition-all text-slate-700 shadow-3xs cursor-pointer"
              title={idt("កាលបរិច្ឆេទបញ្ចប់", "End Date", "结束日期")}
            />
            {(startDateFilter || endDateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setStartDateFilter("");
                  setEndDateFilter("");
                }}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-all cursor-pointer border border-rose-100 hover:border-rose-200 flex items-center justify-center shrink-0"
                title={idt("សម្អាតកាលបរិច្ឆេទ", "Clear Dates", "清除日期")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown status */}
        <div className="flex items-center gap-2.5 min-w-[200px] shrink-0">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
            {idt("ស្ថានភាព ៖", "Status:", "状态:")}
          </span>
          <div className="relative flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary-400 focus:bg-white rounded-xl text-xs font-bold focus:outline-none transition-all appearance-none cursor-pointer text-slate-700 shadow-3xs"
            >
              <option value="ទាំងអស់ (All)">{idt("ទាំងអស់ (All)", "All Statuses", "所有状态")}</option>
              {statuses.map((st, i) => (
                <option key={i} value={st}>{translateData(st)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div id={viewMode === "inventory" ? "print-section" : undefined} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Print Header Logo & School Name (Hidden on web UI, visible in print) */}
        <div className="hidden print:flex flex-col items-center justify-center border-b-2 border-slate-200 pb-6 mb-6 text-center select-none pt-4">
          <h2 className="text-xl font-black text-primary-950 font-moul uppercase leading-relaxed tracking-wider">
            {idt("សាលាបច្ចេកវិទ្យា ភីអិលស៊ី", "PLC TECHNOLOGY SCHOOL", "PLC 技术学校")}
          </h2>
          <p className="text-xs text-slate-500 font-bold tracking-wide uppercase mt-1">
            {idt("បញ្ជីសារពើភ័ណ្ឌគ្រប់គ្រងសម្ភារៈសិក្សា និងឧបករណ៍", "INVENTORY REPORT & ASSETS REGISTER", "库存报告和资产登记簿")}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            {idt(`កាលបរិច្ឆេទរបាយការណ៍ ៖ ${toKhmerNumber(new Date().toLocaleDateString("kh-KH"))}`, `Date of Report: ${new Date().toLocaleDateString()}`, `报告日期: ${new Date().toLocaleDateString()}`)}
          </p>
        </div>

        {/* Outer container responsive */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[9.5px] font-extrabold uppercase tracking-widest select-none">
                <th className="py-2 px-5.5 text-center w-20">ID</th>
                <th className="py-2 px-4 w-[25%]">{idt("ឈ្មោះសម្ភារៈសិក្សា / ឧបករណ៍", "Study Material & description", "学习材料及说明")}</th>
                <th className="py-2 px-4">{idt("ប្រភេទ", "Category", "类别")}</th>
                <th className="py-2 px-4 text-center">{idt("ចំនួន", "Quantity", "数量")}</th>
                <th className="py-2 px-4 text-right">{idt("តម្លៃឯកតា", "Unit Price", "单价")}</th>
                <th className="py-2 px-4 text-right">{idt("តម្លៃសរុប", "Total Value", "总价值")}</th>
                <th className="py-2 px-4">{idt("ទីតាំង (បន្ទប់)", "Location (Room)", "位置（房间）")}</th>
                <th className="py-2 px-4">{idt("អ្នកកាន់កាប់", "In Charge", "负责人")}</th>
                <th className="py-2 px-4">{idt("កាលបរិច្ឆេទ", "Purchase Date", "购买日期")}</th>
                <th className="py-2 px-4 text-center">{idt("ស្ថានភាព", "Status", "状态")}</th>
                <th className="py-2 px-5.5 text-center no-print">{idt("សកម្មភាព", "Actions", "操作")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-bold">
                    {idt("មិនមានទិន្នន័យសម្ភារៈឡើយ", "No asset data found match the filters", "未找到匹配过滤器的资产数据")}
                  </td>
                </tr>
              ) : (
                filteredAssets.map((item, index) => {
                  const itemTotal = item.quantity * item.unitPrice;

                  // Status Badge component
                  const renderStatusBadge = (status: Asset["status"]) => {
                    let classes = "";
                    switch (status) {
                      case "ល្អឥតខ្ចោះ":
                        classes = "bg-emerald-50 text-emerald-700";
                        break;
                      case "ល្អ":
                        classes = "bg-sky-50 text-sky-700";
                        break;
                      case "មធ្យម":
                        classes = "bg-amber-50 text-amber-700";
                        break;
                      case "ខូច/ខូចខាត":
                      case "កំពុងជួសជុល":
                        classes = "bg-rose-50 text-rose-700";
                        break;
                    }

                    return (
                      <span className={`inline-flex items-center px-2.5 py-[2px] rounded-full text-[9.5px] font-black tracking-wide leading-none ${classes}`}>
                        {translateData(status)}
                      </span>
                    );
                  };

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/40 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/10"
                      }`}
                    >
                      {/* ID Badge */}
                      <td className="py-2 px-5.5 text-center whitespace-nowrap">
                        <span className="inline-block px-2 py-[1px] bg-slate-100 text-slate-600 border border-slate-200/50 rounded-lg text-[9.5px] font-bold font-mono tracking-wider whitespace-nowrap">
                          {item.id}
                        </span>
                      </td>

                      {/* Material Name / Subtitle */}
                      <td className="py-2 px-4 max-w-[280px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-extrabold text-slate-800 text-[11.5px] leading-tight">
                            {idt(item.nameKh, item.nameEn)}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium leading-normal line-clamp-1">
                            {idt(item.descriptionKh, item.descriptionEn)}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2 px-4 text-slate-500 font-bold text-[10.5px]">
                        {item.category}
                      </td>

                      {/* Quantity */}
                      <td className="py-2 px-4 text-center font-mono font-extrabold text-slate-800 text-[12px]">
                        {item.quantity}
                      </td>

                      {/* Unit Price */}
                      <td className="py-2 px-4 text-right font-bold text-slate-500 text-[11.5px] font-mono">
                        {uiLang === "kh" ? formatKhmerPrice(item.unitPrice) : `$${item.unitPrice.toFixed(2)}`}
                      </td>

                      {/* Total Price */}
                      <td className="py-2 px-4 text-right font-black text-emerald-600 text-[13px] font-mono">
                        {uiLang === "kh" ? formatKhmerPrice(itemTotal) : `$${itemTotal.toFixed(2)}`}
                      </td>

                      {/* Location */}
                      <td className="py-2 px-4 text-slate-600 font-bold text-[10.5px]">
                        {translateData(item.location)}
                      </td>

                      {/* Person In Charge */}
                      <td className="py-2 px-4 text-slate-700 font-extrabold text-[10.5px] tracking-wide">
                        {item.personInCharge}
                      </td>

                      {/* Purchase Date */}
                      <td className={`py-2 px-4 font-semibold text-slate-500 whitespace-nowrap ${uiLang === "kh" ? "font-sans text-[11.5px]" : "font-mono text-[10.5px]"}`}>
                        {item.purchaseDate ? (uiLang === "kh" ? toKhmerNumber(item.purchaseDate) : item.purchaseDate) : "-"}
                      </td>

                      {/* Status */}
                      <td className="py-2 px-4 text-center">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-5.5 text-center no-print">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => item.quantity > 0 && openSellModal(item)}
                            disabled={item.quantity === 0}
                            className={`p-1 rounded-lg transition-colors border border-transparent ${
                              item.quantity > 0
                                ? "hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 cursor-pointer hover:border-emerald-100"
                                : "text-slate-200 cursor-not-allowed"
                            }`}
                            title={item.quantity > 0 ? idt("លក់ចេញ", "Sell", "出售") : idt("លក់អស់ហើយ", "Sold out", "售罄")}
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1 hover:bg-primary-50 hover:text-primary-600 text-slate-400 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-primary-100"
                            title={idt("កែប្រែ", "Edit", "编辑")}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAsset(item.id)}
                            className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                            title={idt("លុបចេញ", "Delete", "删除")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info row */}
        <div className="py-4.5 px-6 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500">
          <div>
            {idt(
              `បង្ហាញទិន្នន័យសរុប ${toKhmerNumber(filteredAssets.length)} មុខ`, 
              `Showing ${filteredAssets.length} total entries`
            )}
          </div>
          <div className="text-slate-800 text-[13px] font-black tracking-tight">
            <span>{idt("តម្លៃសរុប ៖ ", "Total Valuation: ", "总估值： ")}</span>
            <span className="text-emerald-600 font-mono text-sm ml-1">
              {uiLang === "kh" 
                ? formatKhmerPrice(filteredAssets.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))
                : `$${filteredAssets.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
        </div>
      </div>
        </>
      )}

      {viewMode === "sales" && (
        <div className="space-y-6">
          {/* Sales Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 no-print animate-fade-in">
            {/* Total Sales Revenue */}
            <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-emerald-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
              <div className="relative z-10 space-y-1.5 pr-2">
                <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                  {idt("ចំណូលពីការលក់សរុប", "Total Sales Revenue", "总销售收入")}
                </p>
                <div className="flex items-end gap-3 mb-2.5">
                  <p className="text-2xl lg:text-3xl font-black text-emerald-600 font-mono tracking-tight leading-none">
                    {uiLang === "kh" 
                      ? formatKhmerPrice(totalSalesRevenue) 
                      : `$${totalSalesRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-emerald-750">{idt("គិតជាដុល្លារអាមេរិក (USD)", "Revenue in USD", "美元收入")}</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:rotate-3 group-hover:shadow-md">
                <DollarSign className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            {/* Total Items Sold */}
            <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-primary-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-primary-500"></div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
              <div className="relative z-10 space-y-1.5 pr-2">
                <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                  {idt("ចំនួនលក់ចេញសរុប", "Total Units Sold", "总售出件数")}
                </p>
                <div className="flex items-end gap-3 mb-2.5">
                  <p className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight leading-none">
                    {idt(`${toKhmerNumber(totalQuantitySold)}`, `${totalQuantitySold}`)} <span className="text-lg lg:text-xl font-bold">{idt("គ្រឿង", "Units", "件")}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-primary-700/90">{idt("បរិមាណលក់សរុប (Total Volume)", "Total volume sold", "总销量")}</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 border border-primary-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:rotate-3 group-hover:shadow-md">
                <Package className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            {/* Unique Items Sold */}
            <div className="bg-white rounded-2xl border border-slate-200/65 shadow-sm hover:shadow-md hover:border-blue-300 p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500"></div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500"></div>
              <div className="relative z-10 space-y-1.5 pr-2">
                <p className="text-[9.5px] font-extrabold text-slate-400 tracking-wider uppercase">
                  {idt("មុខសម្ភារៈដែលបានលក់", "Unique Items Sold", "售出的独特物品")}
                </p>
                <div className="flex items-end gap-3 mb-2.5">
                  <p className="text-2xl lg:text-3xl font-black text-blue-600 tracking-tight leading-none">
                    {idt(`${toKhmerNumber(totalUniqueItemsSold)}`, `${totalUniqueItemsSold}`)} <span className="text-lg lg:text-xl font-bold">{idt("មុខ", "Types", "种类")}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-blue-700/90">{idt("ប្រភេទផ្សេងៗគ្នា (Unique Variants)", "Distinct product variants", "不同的产品变体")}</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/70 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:rotate-3 group-hover:shadow-md">
                <CheckCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Sales Search and Filters panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4.5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 no-print">
            {/* Search input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={salesSearchQuery}
                onChange={(e) => setSalesSearchQuery(e.target.value)}
                placeholder={idt("ស្វែងរកឈ្មោះសម្ភារៈ ប្រភេទ ឬសម្គាល់លក់ចេញ...", "Search sold items by name, category, notes...", "按名称、类别、备注搜索售出物品...")}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary-400 focus:bg-white rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-3xs"
              />
            </div>

            {/* Date search input */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider px-2 shrink-0">
                {idt("កាលបរិច្ឆេទលក់ ៖", "Sale Date:", "销售日期:")}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={salesStartDate}
                  onChange={(e) => setSalesStartDate(e.target.value)}
                  className="bg-white border border-slate-250 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-600 focus:outline-none focus:border-primary-400 hover:bg-slate-50 shadow-3xs"
                />
                <span className="text-slate-400 text-xs font-bold">-</span>
                <input
                  type="date"
                  value={salesEndDate}
                  onChange={(e) => setSalesEndDate(e.target.value)}
                  className="bg-white border border-slate-250 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-600 focus:outline-none focus:border-primary-400 hover:bg-slate-50 shadow-3xs"
                />
              </div>
              {(salesStartDate || salesEndDate) && (
                <button
                  onClick={() => {
                    setSalesStartDate("");
                    setSalesEndDate("");
                  }}
                  className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors cursor-pointer"
                  title={idt("សម្អាតតម្រង", "Clear filters", "清除过滤")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sales History Table */}
          <div id={viewMode === "sales" ? "print-section" : undefined} className="bg-white rounded-3xl border border-slate-200/95 shadow-3xs overflow-hidden">
            {/* Print Header Logo & School Name (Hidden on web UI, visible in print) */}
            <div className="hidden print:flex flex-col items-center justify-center border-b-2 border-slate-200 pb-6 mb-6 text-center select-none pt-4">
              <h2 className="text-xl font-black text-primary-950 font-moul uppercase leading-relaxed tracking-wider">
                {idt("សាលាបច្ចេកវិទ្យា ភីអិលស៊ី", "PLC TECHNOLOGY SCHOOL", "PLC 技术学校")}
              </h2>
              <p className="text-xs text-slate-500 font-bold tracking-wide uppercase mt-1">
                {idt("របាយការណ៍លក់ចេញជាក់ស្ដែង", "SALES OUTPUT REPORT", "实际销售报告")}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                {idt(`កាលបរិច្ឆេទរបាយការណ៍ ៖ ${toKhmerNumber(new Date().toLocaleDateString("kh-KH"))}`, `Date of Report: ${new Date().toLocaleDateString()}`, `报告日期: ${new Date().toLocaleDateString()}`)}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5 text-center min-w-[100px] whitespace-nowrap">{idt("លេខកូដ", "Sale ID", "销售编号")}</th>
                    <th className="py-3 px-5">{idt("ឈ្មោះសម្ភារៈ", "Material Name", "材料名称")}</th>
                    <th className="py-3 px-4">{idt("ប្រភេទ", "Category", "类别")}</th>
                    <th className="py-3 px-4 text-center w-[100px]">{idt("ចំនួនលក់", "Qty Sold", "售出数量")}</th>
                    <th className="py-3 px-4 text-right w-[120px]">{idt("តម្លៃឯកតា", "Unit Price", "单价")}</th>
                    <th className="py-3 px-4 text-right w-[130px]">{idt("ចំណូលសរុប", "Total Revenue", "总收入")}</th>
                    <th className="py-3 px-4 w-[130px]">{idt("កាលបរិច្ឆេទលក់", "Sale Date", "销售日期")}</th>
                    <th className="py-3 px-4">{idt("កំណត់សម្គាល់", "Notes/Buyer", "备注/买家")}</th>
                    <th className="py-3 px-5 text-center min-w-[100px] no-print">{idt("សកម្មភាព", "Action", "操作")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                          <Package className="w-10 h-10 opacity-40 stroke-[1.5]" />
                          <div className="text-slate-500 font-extrabold text-xs">
                            {idt("មិនមានកំណត់ត្រាលក់ចេញត្រូវបានរកឃើញទេ", "No sale records found", "未找到销售记录")}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale, idx) => {
                      return (
                        <tr 
                          key={sale.id} 
                          className={`hover:bg-slate-50/40 transition-colors duration-150 ${
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/10"
                          }`}
                        >
                          <td className="py-2 px-5 text-center whitespace-nowrap">
                            <span className="inline-block px-2 py-[1px] bg-slate-100 text-slate-600 border border-slate-200/50 rounded-lg text-[9.5px] font-bold font-mono tracking-wider whitespace-nowrap">
                              {"SL-" + String(filteredSales.length - idx).padStart(3, '0')}
                            </span>
                          </td>
                          <td className="py-2 px-4 max-w-[280px]">
                            <div className="font-extrabold text-slate-800 tracking-tight leading-snug">
                              {sale.nameKh}
                            </div>
                            {sale.nameEn && (
                              <div className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5">
                                {sale.nameEn}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-4 text-slate-500 font-bold text-[10.5px]">
                            {sale.category}
                          </td>
                          <td className="py-2 px-4 text-center font-mono font-extrabold text-slate-800 text-[12px]">
                            {sale.quantitySold}
                          </td>
                          <td className="py-2 px-4 text-right font-bold text-slate-500 text-[11.5px] font-mono">
                            {uiLang === "kh" ? formatKhmerPrice(sale.pricePerUnit) : `$${sale.pricePerUnit.toFixed(2)}`}
                          </td>
                          <td className="py-2 px-4 text-right font-black text-emerald-600 text-[13px] font-mono">
                            {uiLang === "kh" ? formatKhmerPrice(sale.totalRevenue) : `$${sale.totalRevenue.toFixed(2)}`}
                          </td>
                          <td className={`py-2 px-4 font-semibold text-slate-500 whitespace-nowrap ${uiLang === "kh" ? "font-sans text-[11.5px]" : "font-mono text-[10.5px]"}`}>
                            {sale.saleDate ? (uiLang === "kh" ? toKhmerNumber(sale.saleDate) : sale.saleDate) : "-"}
                          </td>
                          <td className="py-2 px-4 text-slate-500 font-medium text-[11px] max-w-[200px] truncate" title={sale.note}>
                            {sale.note || "-"}
                          </td>
                          <td className="py-2 px-5 text-center no-print">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditSaleModal(sale)}
                                className="p-1.5 hover:bg-primary-50 hover:text-primary-600 text-slate-400 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-primary-100"
                                title={idt("កែប្រែ", "Edit", "编辑")}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUndoSale(sale)}
                                className="p-1.5 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                                title={idt("លុបកំណត់ត្រា និងបញ្ជូនចំនួនត្រឡប់មកវិញ", "Delete record and restore quantity", "删除记录并恢复数量")}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Sales Footer */}
            <div className="py-4.5 px-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <div>
                {idt(
                  `បង្ហាញកំណត់ត្រាលក់ចេញសរុប ${toKhmerNumber(filteredSales.length)} លើក`,
                  `Showing ${filteredSales.length} total sales entries`
                )}
              </div>
              <div className="text-slate-800 text-[13px] font-black tracking-tight">
                <span>{idt("ចំណូលសរុប ៖ ", "Total Revenue: ", "总收入： ")}</span>
                <span className="text-emerald-600 font-mono text-sm ml-1">
                  {uiLang === "kh"
                    ? formatKhmerPrice(totalSalesRevenue)
                    : `$${totalSalesRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS - ADD / EDIT */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden"
            >
              {/* Modal Title header */}
              <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                    {showAddModal 
                      ? idt("បន្ថែមសម្ភារៈថ្មីចូលក្នុងបញ្ជី", "Add New Study Asset to Register", "添加新学习资产至登记簿")
                      : idt("កែប្រែព័ត៌មានលម្អិតសម្ភារៈ", "Modify Material Information Details", "修改材料信息详情")}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={showAddModal ? handleAddAsset : handleEditAsset} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Names input group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("ឈ្មោះសម្ភារៈ (ភាសាខ្មែរ) *", "Material Name (Khmer) *", "材料名称（高棉语）*")}
                    </label>
                    <input
                      type="text"
                      required
                      value={formNameKh}
                      onChange={(e) => setFormNameKh(e.target.value)}
                      placeholder={idt("ឧ. កុំព្យូទ័រ Dell Desktop", "e.g., Dell Desktop PC", "例如：戴尔台式电脑")}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("ឈ្មោះសម្ភារៈ (English)", "Material Name (English)", "材料名称（英语）")}
                    </label>
                    <input
                      type="text"
                      value={formNameEn}
                      onChange={(e) => setFormNameEn(e.target.value)}
                      placeholder="e.g., Dell Desktop PC"
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Description info inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("ព័ត៌មានពិពណ៌នា (ខ្មែរ)", "Khmer description/subtitle", "高棉语描述/副标题")}
                    </label>
                    <input
                      type="text"
                      value={formDescKh}
                      onChange={(e) => setFormDescKh(e.target.value)}
                      placeholder={idt("ឧ. សម្រាប់បន្ទប់ពិសោធន៍សិស្ស", "e.g., for computer lab students", "例如：供计算机实验室学生使用")}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("ព័ត៌មានពិពណ៌នា (English)", "English description/subtitle", "英语描述/副标题")}
                    </label>
                    <input
                      type="text"
                      value={formDescEn}
                      onChange={(e) => setFormDescEn(e.target.value)}
                      placeholder="e.g., for student lab use"
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("ប្រភេទសម្ភារៈ *", "Material Category *", "材料类别 *")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowManageCategories(true)}
                      className="text-[11px] font-black text-primary-600 hover:text-primary-500 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3 h-3 stroke-[2.5]" />
                      <span>{idt("កែប្រែ/លុបប្រភេទ", "Manage Categories", "管理类别")}</span>
                    </button>
                  </div>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer text-slate-700"
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{translateData(cat)}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity and Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("ចំនួន (គ្រឿង/មុខ) *", "Quantity (Units) *", "数量（件）*")}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("តម្លៃឯកតា ($ USD) *", "Unit Price ($ USD) *", "单价（美元）*")}
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      value={formUnitPrice}
                      onChange={(e) => setFormUnitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* Location and Handler */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("ទីតាំង (បន្ទប់សិក្សា)", "Location (Room)", "位置（房间）")}
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder={idt("ឧ. បន្ទប់កុំព្យូទ័រ ១", "e.g., Computer Lab 1", "例如：计算机实验室 1")}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("អ្នកទទួលខុសត្រូវ / កាន់កាប់", "In Charge / Handler", "负责人/处理人")}
                    </label>
                    <input
                      type="text"
                      value={formPerson}
                      onChange={(e) => setFormPerson(e.target.value)}
                      placeholder="e.g., SORN SAVY"
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                 {/* Status Selection & Purchase Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                        {idt("ស្ថានភាពបច្ចុប្បន្ន *", "Current Status Condition *", "当前状态情况 *")}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowManageStatuses(true)}
                        className="text-[11px] font-black text-primary-600 hover:text-primary-500 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3 h-3 stroke-[2.5]" />
                        <span>{idt("កែប្រែ/លុបស្ថានភាព", "Manage Statuses", "管理状态")}</span>
                      </button>
                    </div>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-bold focus:outline-none transition-all cursor-pointer text-slate-700"
                    >
                      {statuses.map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("កាលបរិច្ឆេទនៃការទិញចូល", "Purchase Date", "购买日期")}
                    </label>
                    <input
                      type="date"
                      value={formPurchaseDate}
                      onChange={(e) => setFormPurchaseDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-850 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Form submit/cancel footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                  >
                    {idt("បោះបង់", "Cancel", "取消")}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-primary-600/10 hover:shadow-lg flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{showAddModal ? idt("បន្ថែម", "Add Asset", "添加资产") : idt("រក្សាទុក", "Save Changes", "保存更改")}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL - SELL ASSET */}
      <AnimatePresence>
        {showSellModal && sellAsset && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Title header */}
              <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                    {idt("លក់ចេញសម្ភារៈសិក្សា", "Sell Study Material", "出售学习材料")}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleSellAssetSubmit} className="p-6 space-y-4">
                {/* Asset Selection / Display Info */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">
                      {idt("ជ្រើសរើសសម្ភារៈដែលត្រូវលក់ចេញ", "Select Asset to Sell", "选择要出售的资产")}
                    </label>
                    <select
                      value={sellAsset.id}
                      onChange={(e) => {
                        const selected = assets.find(a => a.id === e.target.value);
                        if (selected) {
                          setSellAsset(selected);
                          setSellPrice(selected.unitPrice);
                          setSellQuantity(1);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none transition-all shadow-sm truncate"
                    >
                      {assets.filter(a => a.quantity > 0 || a.id === sellAsset.id).map(a => {
                        const displayName = a.nameKh + (a.nameEn ? ` (${a.nameEn})` : '');
                        const truncatedName = displayName.length > 35 ? displayName.substring(0, 35) + '...' : displayName;
                        return (
                          <option key={a.id} value={a.id} disabled={a.quantity === 0 && a.id !== sellAsset.id}>
                            {truncatedName} - {idt("នៅសល់:", "Stock:", "库存：")} {a.quantity}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs font-bold text-slate-500">
                    <span>
                      {idt("ចំនួនដែលមាន ៖", "In Stock:", "库存数：")} <span className="font-mono text-slate-800 font-black">{sellAsset.quantity}</span>
                    </span>
                    <span>
                      {idt("តម្លៃទិញដើម ៖", "Cost Price:", "成本价：")} <span className="font-mono text-primary-600 font-black">${sellAsset.unitPrice.toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Sell Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                      {idt("ចំនួនលក់ចេញ *", "Quantity to Sell *", "出售数量 *")}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={sellAsset.quantity}
                      value={sellQuantity}
                      onChange={(e) => setSellQuantity(Math.min(sellAsset.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all"
                    />
                    <div className="text-[10px] font-bold text-slate-400">
                      {idt(`លក់បានពី ១ ដល់ ${sellAsset.quantity}`, `Select between 1 to ${sellAsset.quantity}`, `请选择 1 到 ${sellAsset.quantity}`)}
                    </div>
                  </div>

                  {/* Sell Price per unit */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block truncate">
                      {idt("តម្លៃលក់ឯកតា ($) *", "Unit Price ($) *", "单价（$）*")}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min={0}
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Sale Date */}
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                    {idt("កាលបរិច្ឆេទលក់ *", "Sale Date *", "销售日期 *")}
                  </label>
                  <input
                    type="date"
                    required
                    value={sellDate}
                    onChange={(e) => setSellDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer text-slate-700"
                  />
                </div>

                {/* Note / Buyer Info */}
                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                    {idt("កំណត់សម្គាល់លក់ចេញ", "Sale notes / buyer details", "销售说明/买家详情")}
                  </label>
                  <input
                    type="text"
                    value={sellNote}
                    onChange={(e) => setSellNote(e.target.value)}
                    placeholder={idt("ឈ្មោះអ្នកទិញ ឬមូលហេតុលក់", "Buyer name or sale reason", "买家姓名或销售原因")}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Estimated Total Revenue display */}
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs font-extrabold text-emerald-700">
                  <span>{idt("ចំណូលប៉ាន់ស្មានសរុប ៖", "Estimated Total Revenue:", "预计总收入：")}</span>
                  <span className="text-sm font-black font-mono">
                    ${(sellQuantity * sellPrice).toFixed(2)}
                  </span>
                </div>

                {/* Form submit/cancel footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSellModal(false)}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                  >
                    {idt("បោះបង់", "Cancel", "取消")}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-emerald-600/10 hover:shadow-lg flex items-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{idt("យល់ព្រមលក់", "Confirm Sale", "确认销售")}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL - EDIT SALE */}
      <AnimatePresence>
        {showEditSaleModal && editSaleTarget && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Edit className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                    {idt("កែប្រែកំណត់ត្រាលក់ចេញ", "Edit Sale Record", "编辑销售记录")}
                  </h3>
                </div>
                <button
                  onClick={() => setShowEditSaleModal(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>

              <form onSubmit={handleEditSaleSubmit} className="p-6 space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">
                    {idt("សម្ភារៈ", "Asset", "资产")}
                  </span>
                  <div className="text-sm font-black text-slate-800">
                    {editSaleTarget.nameKh}
                  </div>
                  {editSaleTarget.nameEn && (
                    <div className="text-xs text-slate-500 font-semibold">
                      {editSaleTarget.nameEn}
                    </div>
                  )}
                  {(() => {
                    const originalAsset = assets.find(a => a.id === editSaleTarget.assetId);
                    return originalAsset ? (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs font-bold text-slate-500 mt-2">
                        <span>
                          {idt("ចំនួនលក់អតិបរមា ៖", "Max Allowed:", "最大允许值：")} <span className="font-mono text-slate-800 font-black">{originalAsset.quantity + editSaleTarget.quantitySold}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs font-bold text-slate-500 mt-2">
                        <span className="text-rose-500">
                          {idt("មិនអាចផ្លាស់ប្តូរចំនួនបានទេ (សម្ភារៈដើមត្រូវបានលុប)", "Cannot change quantity (original asset deleted)", "无法更改数量（原资产已删除）")}
                        </span>
                      </div>
                    )
                  })()}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                    {idt("ចំនួនលក់ចេញ *", "Quantity Sold *", "售出数量 *")}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={assets.find(a => a.id === editSaleTarget.assetId) ? assets.find(a => a.id === editSaleTarget.assetId)!.quantity + editSaleTarget.quantitySold : editSaleTarget.quantitySold}
                    value={editSaleQuantity}
                    onChange={(e) => setEditSaleQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={!assets.find(a => a.id === editSaleTarget.assetId)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                    {idt("តម្លៃលក់ឯកតា ($) *", "Selling Price per Unit ($) *", "每件售价（美元）*")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min={0}
                    value={editSalePrice}
                    onChange={(e) => setEditSalePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                    {idt("កាលបរិច្ឆេទលក់ *", "Sale Date *", "销售日期 *")}
                  </label>
                  <input
                    type="date"
                    required
                    value={editSaleDate}
                    onChange={(e) => setEditSaleDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11.5px] font-black text-slate-500 uppercase tracking-wider block">
                    {idt("កំណត់សម្គាល់លក់ចេញ", "Sale notes / buyer details", "销售说明/买家详情")}
                  </label>
                  <input
                    type="text"
                    value={editSaleNote}
                    onChange={(e) => setEditSaleNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="p-3 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-between text-xs font-extrabold text-primary-700">
                  <span>{idt("ចំណូលសរុប ៖", "Total Revenue:", "总收入：")}</span>
                  <span className="text-sm font-black font-mono">
                    ${(editSaleQuantity * editSalePrice).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditSaleModal(false)}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                  >
                    {idt("បោះបង់", "Cancel", "取消")}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-primary-600/10 hover:shadow-lg flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{idt("រក្សាទុកកែប្រែ", "Save Changes", "保存更改")}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Management Modal */}
      <AnimatePresence>
        {showManageCategories && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                    {idt("គ្រប់គ្រងប្រភេទសម្ភារៈ", "Manage Material Categories", "管理材料类别")}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowManageCategories(false);
                    setEditingCategoryIndex(null);
                  }}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Add New Category form section */}
              <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      placeholder={idt("បញ្ចូលឈ្មោះប្រភេទសម្ភារៈថ្មី...", "Enter new category name...", "输入新类别名称...")}
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-3xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{idt("បន្ថែម", "Add", "添加")}</span>
                  </button>
                </form>
              </div>

              {/* Categories list section */}
              <div className="p-6 max-h-[40vh] overflow-y-auto space-y-2.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                  {idt("បញ្ជីប្រភេទបច្ចុប្បន្ន", "CURRENT CATEGORIES REGISTERED", "当前已注册类别")}
                </label>

                {categories.map((cat, idx) => {
                  const isEditing = editingCategoryIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group animate-fade-in"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            required
                            value={editingCategoryValue}
                            onChange={(e) => setEditingCategoryValue(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 focus:border-primary-400 rounded-lg text-xs font-bold focus:outline-none text-slate-800"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditCategory(cat, editingCategoryValue);
                              } else if (e.key === "Escape") {
                                setEditingCategoryIndex(null);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleEditCategory(cat, editingCategoryValue)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                            title={idt("រក្សាទុក", "Save", "保存")}
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategoryIndex(null)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            title={idt("បោះបង់", "Cancel", "取消")}
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-slate-700 tracking-tight pr-4 truncate">
                            {translateData(cat)}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryIndex(idx);
                                setEditingCategoryValue(cat);
                              }}
                              className="p-1.5 hover:bg-primary-50 hover:text-primary-600 text-slate-400 border border-transparent hover:border-primary-100 rounded-lg transition-colors cursor-pointer"
                              title={idt("កែប្រែ", "Edit", "编辑")}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-transparent hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
                              title={idt("លុប", "Delete", "删除")}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Close footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowManageCategories(false);
                    setEditingCategoryIndex(null);
                  }}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                >
                  {idt("បិទជិត", "Close", "关闭")}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Management Modal */}
      <AnimatePresence>
        {showManageStatuses && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                <div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                    {idt("គ្រប់គ្រងស្ថានភាពសម្ភារៈ", "Manage Material Statuses", "管理材料状态")}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowManageStatuses(false);
                    setEditingStatusIndex(null);
                  }}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Add New Status form section */}
              <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <form onSubmit={handleAddStatus} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      placeholder={idt("បញ្ចូលឈ្មោះស្ថានភាពថ្មី...", "Enter new status name...", "输入新状态名称...")}
                      value={newStatusName}
                      onChange={(e) => setNewStatusName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-primary-400 rounded-xl text-xs font-semibold focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-3xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{idt("បន្ថែម", "Add", "添加")}</span>
                  </button>
                </form>
              </div>

              {/* Statuses list section */}
              <div className="p-6 max-h-[40vh] overflow-y-auto space-y-2.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                  {idt("បញ្ជីស្ថានភាពបច្ចុប្បន្ន", "CURRENT STATUSES REGISTERED", "当前已注册状态")}
                </label>

                {statuses.map((st, idx) => {
                  const isEditing = editingStatusIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50/80 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group animate-fade-in"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            required
                            value={editingStatusValue}
                            onChange={(e) => setEditingStatusValue(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 focus:border-primary-400 rounded-lg text-xs font-bold focus:outline-none text-slate-800"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditStatus(st, editingStatusValue);
                              } else if (e.key === "Escape") {
                                setEditingStatusIndex(null);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleEditStatus(st, editingStatusValue)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                            title={idt("រក្សាទុក", "Save", "保存")}
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStatusIndex(null)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                            title={idt("បោះបង់", "Cancel", "取消")}
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-bold text-slate-700 tracking-tight pr-4 truncate">
                            {st}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStatusIndex(idx);
                                setEditingStatusValue(st);
                              }}
                              className="p-1.5 hover:bg-primary-50 hover:text-primary-600 text-slate-400 border border-transparent hover:border-primary-100 rounded-lg transition-colors cursor-pointer"
                              title={idt("កែប្រែ", "Edit", "编辑")}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStatus(st)}
                              className="p-1.5 hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-transparent hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
                              title={idt("លុប", "Delete", "删除")}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Close footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowManageStatuses(false);
                    setEditingStatusIndex(null);
                  }}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                >
                  {idt("បិទជិត", "Close", "关闭")}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
                <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
                <div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full relative z-10 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 animate-pulse">
                <AlertTriangle className="w-7 h-7 stroke-[2.25]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-800 tracking-tight leading-tight">
                  បញ្ជាក់ការលុបទិន្នន័យ
                </h3>
                <p className="text-[11.5px] text-slate-400 font-bold">
                  Confirm Data Deletion
                </p>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed font-bold">
                <div>
                  {uiLang === "kh" ? deleteConfirm.messageKh : deleteConfirm.messageEn}
                </div>
                <div className="mt-2.5 px-3 py-2 bg-rose-50/50 border border-rose-100/50 rounded-xl text-rose-700 text-xs font-black break-all font-sans inline-block">
                  "{uiLang === "kh" ? deleteConfirm.nameKh : deleteConfirm.nameEn}"
                </div>
                <p className="mt-2.5 text-[10px] text-slate-400 font-bold">
                  ការលុបនេះមិនអាចយកមកវិញបានទេ!
                </p>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                >
                  {idt("បោះបង់", "Cancel", "取消")}
                </button>
                <button
                  type="button"
                  onClick={deleteConfirm.onConfirm}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-rose-200"
                >
                  {idt("យល់ព្រម", "Delete", "删除")}
                </button>
              </div>
            </div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
