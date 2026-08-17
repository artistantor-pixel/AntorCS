"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderKanban, Briefcase, Type, Plus, Edit2, Trash2, Copy,
  Save, X, Search, Filter, CheckSquare, Square, RefreshCw, 
  AlertCircle, CheckCircle, Video, Image as ImageIcon, ExternalLink, Calendar,
  Bell, ChevronDown, Award, PieChart, Activity, Cpu, Database, Calculator, FileText, ShoppingCart, Mail, MessageCircle, Menu, Users,
  ArrowUp, ArrowDown, GripVertical, Code, Volume2, Link as LinkIcon, Star
} from "lucide-react";


// Types
interface Project {
  id: number;
  titleKey: string;
  categoryKey: string;
  title: string;
  slug: string;
  image: string;
  videoUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  size: string;
  year: string;
  catId: string;
  client?: string;
  duration?: string;
  role?: string;
  liveLink?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  results: any;
  gallery: any;
  blocks?: any;
  themeBackground?: string;
  tools?: any;
  keywords?: any;
  updatedAt?: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  pdfUrl: string;
  image: string;
  isActive: boolean;
}

interface Order {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  whatsappNumber: string;
  productTitle: string;
  price: number;
  paymentMethod: string;
  trxId: string;
  status: string; // PENDING, APPROVED, REJECTED
  createdAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  time?: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  type: "BOSS_TASK" | "CLIENT_WORK" | "GRAPHIC" | "MOTION" | "SOCIAL";
  description?: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(1428);
  const [workspaceUsers, setWorkspaceUsers] = useState<any[]>([]);
  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [socialProof, setSocialProof] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);


  // Calendar States
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [editingCalendarEvent, setEditingCalendarEvent] = useState<CalendarEvent | null>(null);
  const [calendarFilterPriority, setCalendarFilterPriority] = useState<string>("all");
  const [calendarFilterType, setCalendarFilterType] = useState<string>("all");
  const [calendarFilterStatus, setCalendarFilterStatus] = useState<string>("all");
  const [isSavingCalendarEvent, setIsSavingCalendarEvent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Estimator Pricing Config State
  const [calculatorConfig, setCalculatorConfig] = useState<any>({
    brandingBase: 25000,
    brandingLogoExtra: 5000,
    brandingGuidelines: 10000,
    brandingSocial: 5000,
    brandingStationery: 3000,
    motionBase: 30000,
    motionDurationExtra: 5000,
    motionStyle3dExtra: 20000,
    motionVoiceover: 5000,
    motionSfx: 3000,
    uiuxBase: 40000,
    uiuxScreenExtra: 3000,
    uiuxPrototype: 10000,
    uiuxDesignSystem: 15000,
    uiuxResponsive: 10000,
    illustrationBase: 15000,
    illustrationExtra: 3000,
    illustrationCharacterDesign: 8000,
    illustrationStoryboard: 10000,
    illustrationVectorHandoff: 5000,
    creativeDirectionBase: 50000,
    creativeDirectionDayExtra: 10000,
    creativeDirection3dMapping: 25000,
    creativeDirectionPrintCollaterals: 15000,
    creativeDirectionCurationConsulting: 20000,
    timelineRushMultiplier: 1.3
  });
  const [isSavingCalculator, setIsSavingCalculator] = useState(false);

  // Search & Filters (Projects)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Search & Filters (Products)
  const [productQuery, setProductQuery] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Search & Filters (Orders)
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"orders" | "emails">("orders");
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | "PENDING" | "APPROVED" | "REJECTED">("all");
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [recruitmentProposals, setRecruitmentProposals] = useState<any[]>([]);
  const [homeConfig, setHomeConfig] = useState<any[]>([]);

  // Modal Editing
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch projects
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjectsData(data);
      }

      // Fetch calculator config
      const calcRes = await fetch("/api/calculator", { cache: "no-store" });
      const calcData = await calcRes.json();
      if (calcData && typeof calcData === "object") {
        setCalculatorConfig(calcData);
      }

      // Fetch products
      const prodRes = await fetch("/api/products", { cache: "no-store" });
      const prodData = await prodRes.json();
      if (Array.isArray(prodData)) {
        setProductsData(prodData);
      }

      // Fetch orders
      const ordRes = await fetch("/api/orders", { cache: "no-store" });
      const ordData = await ordRes.json();
      if (Array.isArray(ordData)) {
        setOrdersData(ordData);
      }

      // Fetch simulated email logs
      const logsRes = await fetch("/api/orders?type=email-logs", { cache: "no-store" });
      const logsData = await logsRes.json();
      if (Array.isArray(logsData)) {
        setEmailLogs(logsData);
      }

      // Fetch recruitment proposals
      const recRes = await fetch("/api/recruitment", { cache: "no-store" });
      const recData = await recRes.json();
      if (Array.isArray(recData)) {
        setRecruitmentProposals(recData);
      }

      // Fetch home config layout
      const hcRes = await fetch("/api/home-config", { cache: "no-store" });
      const hcData = await hcRes.json();
      if (Array.isArray(hcData)) {
        setHomeConfig(hcData.sort((a, b) => a.order - b.order));
      }

      // Fetch visitors count
      const visRes = await fetch("/api/visitors", { cache: "no-store" });
      const visData = await visRes.json();
      if (visData && typeof visData.count === "number") {
        setVisitorCount(visData.count);
      }

      // Fetch content calendar events
      const calRes = await fetch("/api/calendar", { cache: "no-store" });
      const calData = await calRes.json();
      if (Array.isArray(calData)) {
        setCalendarEvents(calData);
      }

      // Fetch registered workspace users
      try {
        const usersRes = await fetch("/api/admin/users", { cache: "no-store" });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (Array.isArray(usersData)) setWorkspaceUsers(usersData);
        }
      } catch (err) {
        console.error(err);
      }

      // Fetch reviews
      try {
        const revRes = await fetch("/api/admin/reviews", { cache: "no-store" });
        if (revRes.ok) {
          const revData = await revRes.json();
          if (Array.isArray(revData)) setReviewsData(revData);
        }
      } catch (err) {
        console.error(err);
      }

      // Fetch social proof
      try {
        const spRes = await fetch("/api/social-proof");
        if (spRes.ok) {
          const spData = await spRes.json();
          if (Array.isArray(spData)) setSocialProof(spData.join(", "));
        }
      } catch (err) {
        console.error(err);
      }
    } catch (e) {
      addToast("Failed to load dashboard parameters", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkspaceUser = async (email: string) => {
    if (!confirm(`Are you sure you want to permanently delete workspace user "${email}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setWorkspaceUsers(prev => prev.filter(u => u.email !== email));
        addToast("Workspace user successfully removed.", "success");
      } else {
        addToast("Failed to delete workspace user.", "error");
      }
    } catch (e) {
      addToast("Connection error.", "error");
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteRecruitment = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this recruitment proposal?")) return;
    addToast("Deleting proposal...", "info");
    try {
      const res = await fetch(`/api/recruitment?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecruitmentProposals(prev => prev.filter(p => p.id !== id));
        addToast("Proposal deleted successfully", "success");
      } else {
        addToast("Failed to delete proposal", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    }
  };

  const handleToggleSection = (id: string) => {
    setHomeConfig(prev => prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  const handleMoveSection = (id: string, direction: "up" | "down") => {
    const index = homeConfig.findIndex(item => item.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === homeConfig.length - 1) return;

    const newConfig = [...homeConfig];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    
    // Swap items
    const temp = newConfig[index];
    newConfig[index] = newConfig[targetIdx];
    newConfig[targetIdx] = temp;

    // Recalculate order indices
    const updated = newConfig.map((item, idx) => ({ ...item, order: idx + 1 }));
    setHomeConfig(updated);
  };

  const handleSaveHomeConfig = async () => {
    addToast("Saving layout changes...", "info");
    try {
      const res = await fetch("/api/home-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeConfig)
      });
      if (res.ok) {
        addToast("Layout configuration saved successfully!", "success");
      } else {
        addToast("Failed to save layout.", "error");
      }
    } catch (e) {
      addToast("Network error.", "error");
    }
  };

  const handleSaveSocialProof = async () => {
    addToast("Saving social proof...", "info");
    try {
      const logos = socialProof.split(",").map(s => s.trim()).filter(s => s);
      const res = await fetch("/api/social-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logos })
      });
      if (res.ok) {
        addToast("Social proof updated successfully!", "success");
      } else {
        addToast("Failed to update social proof.", "error");
      }
    } catch (e) {
      addToast("Network error.", "error");
    }
  };

  // Save Calendar Event (Insert / Update)
  const handleSaveCalendarEvent = async (eventToSave: CalendarEvent) => {
    if (!eventToSave.title.trim()) {
      addToast("Task Title is required.", "error");
      return;
    }
    
    setIsSavingCalendarEvent(true);
    addToast("Saving schedule event...", "info");
    
    const isNew = !calendarEvents.some(e => e.id === eventToSave.id);
    const updatedEvents = isNew 
      ? [...calendarEvents, eventToSave]
      : calendarEvents.map(e => e.id === eventToSave.id ? eventToSave : e);
      
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvents)
      });
      if (res.ok) {
        setCalendarEvents(updatedEvents);
        setEditingCalendarEvent(null);
        addToast(isNew ? "Event scheduled successfully! 📅" : "Event details updated!", "success");
      } else {
        addToast("Failed to save calendar event.", "error");
      }
    } catch (e) {
      addToast("Network error. Failed to save.", "error");
    } finally {
      setIsSavingCalendarEvent(false);
    }
  };

  // Delete Calendar Event
  const handleDeleteCalendarEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this scheduled event?")) return;
    
    addToast("Deleting event...", "info");
    const updatedEvents = calendarEvents.filter(e => e.id !== eventId);
    
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvents)
      });
      if (res.ok) {
        setCalendarEvents(updatedEvents);
        setEditingCalendarEvent(null);
        addToast("Event deleted from calendar.", "success");
      } else {
        addToast("Failed to delete event.", "error");
      }
    } catch (e) {
      addToast("Network error.", "error");
    }
  };

  // Quick helper to pre-fill a "Boss Task" on a date
  const handleAddQuickBossTask = (dateStr: string) => {
    setEditingCalendarEvent({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      title: "Urgent Boss Request! 🚨",
      clientName: "Boss Request",
      date: dateStr,
      time: "09:00",
      status: "TODO",
      priority: "HIGH",
      type: "BOSS_TASK",
      description: "Sudden request given by the Boss at office. Finish ASAP!"
    });
  };

  // Save Estimator Pricing
  const handleSaveCalculator = async () => {
    setIsSavingCalculator(true);
    addToast("Saving estimator prices...", "info");
    try {
      const res = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(calculatorConfig)
      });
      if (res.ok) {
        addToast("Estimator pricing saved successfully!", "success");
      } else {
        addToast("Failed to save estimator pricing.", "error");
      }
    } catch (e) {
      addToast("Error saving pricing configs.", "error");
    } finally {
      setIsSavingCalculator(false);
    }
  };

  // Inline Toggles - Projects
  const handleToggleStatus = async (project: Project) => {
    const originalStatus = project.isActive;
    const updatedStatus = !originalStatus;

    setProjectsData(prev => prev.map(p => p.id === project.id ? { ...p, isActive: updatedStatus } : p));
    addToast(`Updating status of "${project.title}"...`, "info");

    try {
      const updatedArray = projectsData.map(p => p.id === project.id ? { ...p, isActive: updatedStatus } : p);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedArray)
      });
      if (!res.ok) throw new Error();
      addToast(`Status of "${project.title}" updated successfully`, "success");
    } catch (e) {
      setProjectsData(prev => prev.map(p => p.id === project.id ? { ...p, isActive: originalStatus } : p));
      addToast(`Failed to update status. Rolled back.`, "error");
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    const originalFeatured = project.isFeatured;
    const updatedFeatured = !originalFeatured;

    setProjectsData(prev => prev.map(p => p.id === project.id ? { ...p, isFeatured: updatedFeatured } : p));
    addToast(`Updating featured status of "${project.title}"...`, "info");

    try {
      const updatedArray = projectsData.map(p => p.id === project.id ? { ...p, isFeatured: updatedFeatured } : p);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedArray)
      });
      if (!res.ok) throw new Error();
      addToast(`Featured status of "${project.title}" updated successfully`, "success");
    } catch (e) {
      setProjectsData(prev => prev.map(p => p.id === project.id ? { ...p, isFeatured: originalFeatured } : p));
      addToast(`Failed to update featured status. Rolled back.`, "error");
    }
  };

  // Inline Toggles - Products
  const handleToggleProductStatus = async (product: Product) => {
    const originalStatus = product.isActive;
    const updatedStatus = !originalStatus;

    setProductsData(prev => prev.map(p => p.id === product.id ? { ...p, isActive: updatedStatus } : p));
    addToast(`Updating status of "${product.title}"...`, "info");

    try {
      const updatedArray = productsData.map(p => p.id === product.id ? { ...p, isActive: updatedStatus } : p);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedArray)
      });
      if (!res.ok) throw new Error();
      addToast(`Status of "${product.title}" updated successfully`, "success");
    } catch (e) {
      setProductsData(prev => prev.map(p => p.id === product.id ? { ...p, isActive: originalStatus } : p));
      addToast(`Failed to update status. Rolled back.`, "error");
    }
  };

  // Validation & Save - Projects
  const validateForm = (project: Project): boolean => {
    const errors: Record<string, string> = {};
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

    if (!project.title.trim()) errors.title = "Title is required.";
    if (!project.slug.trim()) errors.slug = "Slug is required.";
    if (!project.catId.trim()) errors.catId = "Category display is required.";
    
    if (project.image && !project.image.startsWith("/") && !urlPattern.test(project.image)) {
      errors.image = "Please enter a valid URL or path.";
    }
    if (project.videoUrl && !project.videoUrl.startsWith("/") && !urlPattern.test(project.videoUrl)) {
      errors.videoUrl = "Please enter a valid URL or path.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveModal = async () => {
    if (!editingProject) return;
    if (!validateForm(editingProject)) {
      addToast("Please correct the form errors before saving.", "error");
      return;
    }

    setIsSaving(true);
    const isNew = !projectsData.find(p => p.id === editingProject.id);
    const updated = isNew 
      ? [...projectsData, editingProject] 
      : projectsData.map(p => p.id === editingProject.id ? editingProject : p);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setProjectsData(updated);
        setEditingProject(null);
        addToast("Feature details saved successfully!", "success");
      } else {
        addToast("Failed to save changes. Please try again.", "error");
      }
    } catch (e) {
      addToast("Network error. Failed to save feature.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Validation & Save - Products
  const validateProductForm = (product: Product): boolean => {
    const errors: Record<string, string> = {};
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

    if (!product.title.trim()) errors.title = "Title is required.";
    if (!product.description.trim()) errors.description = "Description is required.";
    if (!product.pdfUrl.trim()) errors.pdfUrl = "PDF url is required.";
    if (product.price <= 0) errors.price = "Price must be greater than ৳0.";
    
    if (product.image && !product.image.startsWith("/") && !urlPattern.test(product.image)) {
      errors.image = "Please enter a valid URL or path.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProductModal = async () => {
    if (!editingProduct) return;
    if (!validateProductForm(editingProduct)) {
      addToast("Please correct the form errors before saving.", "error");
      return;
    }

    setIsSaving(true);
    const isNew = !productsData.find(p => p.id === editingProduct.id);
    const updated = isNew 
      ? [...productsData, editingProduct] 
      : productsData.map(p => p.id === editingProduct.id ? editingProduct : p);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        addToast("Product detail saved successfully!", "success");
        // Reload products list to get server-side database generated autoincrement ID
        const reFetch = await fetch("/api/products", { cache: "no-store" });
        const reData = await reFetch.json();
        if(Array.isArray(reData)) setProductsData(reData);
        setEditingProduct(null);
      } else {
        addToast("Failed to save changes. Please try again.", "error");
      }
    } catch (e) {
      addToast("Network error. Failed to save product.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Individual
  const handleDeleteIndividual = async (project: Project) => {
    if (!confirm(`Are you sure you want to permanently delete "${project.title}"?`)) return;

    const originalData = [...projectsData];
    const updated = projectsData.filter(p => p.id !== project.id);

    setProjectsData(updated);
    setSelectedIds(prev => prev.filter(id => id !== project.id));
    addToast(`Deleting "${project.title}"...`, "info");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      addToast(`"${project.title}" deleted successfully`, "success");
    } catch (e) {
      setProjectsData(originalData);
      addToast(`Failed to delete "${project.title}". Rolled back.`, "error");
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to permanently delete "${product.title}"?`)) return;

    const originalData = [...productsData];
    const updated = productsData.filter(p => p.id !== product.id);

    setProductsData(updated);
    setSelectedProductIds(prev => prev.filter(id => id !== product.id));
    addToast(`Deleting "${product.title}"...`, "info");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      addToast(`"${product.title}" deleted successfully`, "success");
    } catch (e) {
      setProductsData(originalData);
      addToast(`Failed to delete "${product.title}". Rolled back.`, "error");
    }
  };

  // Bulk Actions - Projects
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProjects.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected features?`)) return;

    const originalData = [...projectsData];
    const updated = projectsData.filter(p => !selectedIds.includes(p.id));

    setProjectsData(updated);
    setSelectedIds([]);
    addToast(`Deleting ${selectedIds.length} features...`, "info");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      addToast(`Successfully deleted selected features.`, "success");
    } catch (e) {
      setProjectsData(originalData);
      addToast("Bulk deletion failed. Rolled back.", "error");
    }
  };

  const handleBulkToggleStatus = async (status: boolean) => {
    if (selectedIds.length === 0) return;

    const originalData = [...projectsData];
    const updated = projectsData.map(p => 
      selectedIds.includes(p.id) ? { ...p, isActive: status } : p
    );

    setProjectsData(updated);
    addToast(`Updating status for selected features...`, "info");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      addToast(`Status updated successfully.`, "success");
    } catch (e) {
      setProjectsData(originalData);
      addToast("Bulk status update failed. Rolled back.", "error");
    }
  };

  // Bulk Actions - Products
  const handleSelectAllProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProductsData.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProductRow = (id: number) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) return;

    const originalData = [...productsData];
    const updated = productsData.filter(p => !selectedProductIds.includes(p.id));

    setProductsData(updated);
    setSelectedProductIds([]);
    addToast(`Deleting ${selectedProductIds.length} products...`, "info");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      addToast(`Successfully deleted selected products.`, "success");
    } catch (e) {
      setProductsData(originalData);
      addToast("Bulk product deletion failed. Rolled back.", "error");
    }
  };

  const handleBulkToggleProductStatus = async (status: boolean) => {
    if (selectedProductIds.length === 0) return;

    const originalData = [...productsData];
    const updated = productsData.map(p => 
      selectedProductIds.includes(p.id) ? { ...p, isActive: status } : p
    );

    setProductsData(updated);
    addToast(`Updating status for selected products...`, "info");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      addToast(`Product status updated successfully.`, "success");
    } catch (e) {
      setProductsData(originalData);
      addToast("Bulk status update failed. Rolled back.", "error");
    }
  };

  // Helper arrays/objects
  const categories = Array.from(new Set(projectsData.map(p => p.catId)));

  // Filter & Search Logic - Projects
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ? true :
                          statusFilter === "active" ? project.isActive : !project.isActive;

    const matchesCategory = categoryFilter === "all" ? true : project.catId === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Filter & Search Logic - Products
  const filteredProductsData = productsData.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(productQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(productQuery.toLowerCase());
    
    const matchesStatus = productStatusFilter === "all" ? true :
                          productStatusFilter === "active" ? product.isActive : !product.isActive;

    return matchesSearch && matchesStatus;
  });

  // Filter & Search Logic - Orders
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.clientName.toLowerCase().includes(orderQuery.toLowerCase()) || 
                          order.clientPhone.includes(orderQuery) || 
                          order.trxId.toLowerCase().includes(orderQuery.toLowerCase()) || 
                          order.productTitle.toLowerCase().includes(orderQuery.toLowerCase());
    
    const matchesStatus = orderStatusFilter === "all" ? true : order.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: number, status: "APPROVED" | "REJECTED") => {
    setIsUpdatingOrder(true);
    addToast(`Updating transaction status...`, "info");
    
    const originalOrders = [...ordersData];
    setOrdersData(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status })
      });
      if (res.ok) {
        addToast(`Order transaction successfully ${status.toLowerCase()}!`, "success");
        // Re-fetch email logs
        const logsRes = await fetch("/api/orders?type=email-logs", { cache: "no-store" });
        const logsData = await logsRes.json();
        if (Array.isArray(logsData)) setEmailLogs(logsData);
      } else {
        setOrdersData(originalOrders);
        addToast(`Failed to update order.`, "error");
      }
    } catch (e) {
      setOrdersData(originalOrders);
      addToast(`Connection error. Rolled back.`, "error");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleSelectAllOrders = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrderRow = (id: number) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkUpdateOrders = async (status: "APPROVED" | "REJECTED") => {
    if (selectedOrderIds.length === 0) return;
    
    addToast(`Batch updating selected transactions...`, "info");
    const originalOrders = [...ordersData];
    
    setOrdersData(prev => prev.map(o => selectedOrderIds.includes(o.id) ? { ...o, status } : o));
    const toUpdate = selectedOrderIds;
    setSelectedOrderIds([]);

    try {
      let succeeded = 0;
      for (const id of toUpdate) {
        const res = await fetch("/api/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status })
        });
        if (res.ok) succeeded++;
      }
      addToast(`Successfully batch updated ${succeeded} transactions!`, "success");
      // Re-fetch email logs
      const logsRes = await fetch("/api/orders?type=email-logs", { cache: "no-store" });
      const logsData = await logsRes.json();
      if (Array.isArray(logsData)) setEmailLogs(logsData);
    } catch (e) {
      setOrdersData(originalOrders);
      addToast(`Batch update failed. Rolled back.`, "error");
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") {
      setIsUploadingImage(true);
    } else {
      setIsUploadingPdf(true);
    }
    
    addToast(`Uploading ${file.name}...`, "info");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        addToast("File uploaded successfully!", "success");
        if (type === "image") {
          setEditingProduct(prev => prev ? { ...prev, image: data.url } : null);
        } else {
          setEditingProduct(prev => prev ? { ...prev, pdfUrl: data.url } : null);
        }
      } else {
        addToast(data.error || "File upload failed.", "error");
      }
    } catch (e) {
      addToast("Network upload error.", "error");
    } finally {
      if (type === "image") {
        setIsUploadingImage(false);
      } else {
        setIsUploadingPdf(false);
      }
    }
  };

  const handleAddNew = () => {
    setEditingProject({
      id: Date.now(),
      titleKey: "",
      categoryKey: "",
      title: "",
      slug: "",
      image: "",
      videoUrl: "",
      isFeatured: false,
      isActive: true,
      size: "medium",
      year: new Date().getFullYear().toString(),
      catId: "Branding",
      client: "",
      duration: "",
      role: "",
      liveLink: "",
      overview: "",
      challenge: "",
      solution: "",
      results: [],
      gallery: [],
      blocks: [],
      themeBackground: "black",
      tools: [],
      keywords: []
    });
    setFormErrors({});
  };

  const handleAddNewProduct = () => {
    setEditingProduct({
      id: Date.now() + 10000000000, // Large temp ID
      title: "",
      description: "",
      price: 0,
      pdfUrl: "",
      image: "",
      isActive: true
    });
    setFormErrors({});
  };

  // Analytical stats
  const totalWorks = projectsData.length;
  const activeWorks = projectsData.filter(p => p.isActive).length;
  const featuredWorks = projectsData.filter(p => p.isFeatured).length;
  const totalProducts = productsData.length;

  const motionCount = projectsData.filter(p => p.catId.toLowerCase().includes("motion")).length;
  const graphicCount = projectsData.filter(p => p.catId.toLowerCase().includes("graphic")).length;
  const otherCount = totalWorks - (motionCount + graphicCount);

  const motionPercent = totalWorks > 0 ? Math.round((motionCount / totalWorks) * 100) : 0;
  const graphicPercent = totalWorks > 0 ? Math.round((graphicCount / totalWorks) * 100) : 0;
  const otherPercent = totalWorks > 0 ? Math.round((otherCount / totalWorks) * 100) : 0;

  // Format Current Date
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Month grid helpers
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const calendarYear = currentCalendarDate.getFullYear();
  const calendarMonth = currentCalendarDate.getMonth();

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);

  // Generate array of calendar days
  const calendarDays: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Add leading offset days from previous month
  const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
  const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: true });
  }

  // Trapping next month days to complete grid cells (multiple of 7)
  const totalGridCells = calendarDays.length <= 35 ? 35 : 42;
  const remaining = totalGridCells - calendarDays.length;
  const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
  const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
  for (let d = 1; d <= remaining; d++) {
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, dateStr, isCurrentMonth: false });
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#EEEDF2] text-[#1F2937] font-sans antialiased">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. DEALDECK STYLE LEFT SIDEBAR (LIGHT NEUMORPHIC) */}
      <aside className={`fixed md:static top-0 left-0 h-full w-[260px] bg-white border-r border-[#E2E8F0] flex flex-col justify-between z-50 shrink-0 select-none shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center font-black text-xl text-white shadow-[0_4px_15px_rgba(225,29,72,0.3)]">
                A
              </div>
              <div>
                <span className="font-bold text-[#111827] text-base block leading-none">AntorStudio</span>
                <span className="text-[9px] text-[#E11D48] font-bold tracking-[0.25em] block mt-1.5 uppercase font-mono">console</span>
              </div>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9CA3AF] tracking-widest block uppercase px-4 mb-2">MENU</span>
            
            <button
              onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "dashboard" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <Activity size={16} />
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab("projects"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "projects" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <FolderKanban size={16} />
              Works & Projects
            </button>
            <button
              onClick={() => { setActiveTab("shop"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "shop" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <Briefcase size={16} />
              Digital Shop
            </button>
            <button
              onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "orders" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <ShoppingCart size={16} />
              Manage Orders
            </button>
            <button
              onClick={() => { setActiveTab("recruitment"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "recruitment" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <Award size={16} />
              Recruiter Proposals
            </button>
            <button
              onClick={() => { setActiveTab("calendar"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "calendar" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <Calendar size={16} />
              Content Calendar
            </button>
            <button
              onClick={() => { setActiveTab("estimator"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "estimator" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <Calculator size={16} />
              Estimator Settings
            </button>
            <button
              onClick={() => { setActiveTab("content"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "content" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <Type size={16} />
              Global Content
            </button>
            <button
              onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "users" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <Users size={16} />
              Workspace Users
            </button>
            <button
              onClick={() => { setActiveTab("reviews"); setSidebarOpen(false); }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeTab === "reviews" 
                  ? "bg-brand-red text-white border-brand-red shadow-[0_4px_20px_rgba(225,29,72,0.25)]" 
                  : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] border-transparent"
              }`}
            >
              <Star size={16} />
              Client Reviews
            </button>
            <a
              href="/admin/ai-leads"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border text-purple-600 bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/20"
            >
              <Cpu size={16} className="text-purple-600" />
              AI Agent & Training 🤖
            </a>
            <a
              href="/admin/manual"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all border text-[#4B5563] hover:text-brand-red hover:bg-[#F3F4F6] border-transparent"
            >
              <Video size={16} className="text-[#ea3f40]" />
              Video Manual 🎬
            </a>
          </nav>
        </div>


        {/* Pro Upgrader Widget */}
        <div className="p-4 mx-4 mb-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-red/5 rounded-full blur-2xl" />
          <div className="w-9 h-9 rounded-xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mb-3">
            <Award size={18} />
          </div>
          <h4 className="text-[#111827] text-xs font-bold font-mono uppercase tracking-wider">AntorOS Active</h4>
          <p className="text-[#6B7280] text-[10px] mt-1 leading-relaxed">Fully synchronized creative suite monitoring leads & production assets.</p>
          <button className="w-full mt-4 bg-brand-red/10 hover:bg-brand-red/20 text-[#E11D48] text-xs font-bold py-2.5 rounded-xl transition-all border border-brand-red/10">
            System Online
          </button>
        </div>
      </aside>

      {/* COMPREHENSIVE MAIN CONTAINER */}
      <main className="flex-1 overflow-y-auto relative bg-[#EEEDF2] flex flex-col min-w-0 w-full">
        
        {/* TOP SYSTEM HEADER */}
        <header className="h-16 md:h-20 border-b border-[#E2E8F0] bg-white/70 backdrop-blur-md px-4 md:px-10 flex justify-between items-center shrink-0 z-20 sticky top-0 shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#4B5563]"
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              <Menu size={18} />
            </button>
            <div>
              <h2 className="text-base md:text-xl font-bold tracking-tight text-[#111827] font-serif">
                Console Control Room
              </h2>
              <p className="hidden sm:block text-[11px] text-[#9CA3AF] font-bold mt-1 font-mono uppercase tracking-widest">Antor Creative Studio Dashboard</p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-6">
            <button className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-brand-red transition-all text-[#4B5563] hover:text-[#111827] shadow-sm">
              <Search size={16} />
            </button>
            <button className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-brand-red transition-all text-[#4B5563] hover:text-[#111827] relative shadow-sm">
              <Bell size={16} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full" />
            </button>
            
            <div className="w-[1px] h-6 bg-[#E2E8F0]" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red font-bold font-mono">
                AB
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-[#111827] block">Antor Biswas</span>
                <span className="text-[9px] text-[#E11D48] font-bold uppercase tracking-wider block mt-0.5 font-mono">Admin store</span>
              </div>
              <ChevronDown size={14} className="text-[#9CA3AF]" />
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] w-full mx-auto flex-1 flex flex-col gap-6 md:gap-8 min-h-0">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Sales Report / Console overview Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#111827] font-serif">Console Report</h3>
                  <p className="text-xs text-[#6B7280] mt-1 font-semibold">{formatDate()}</p>
                </div>
                <button onClick={handleAddNew} className="bg-brand-red hover:bg-blood-red text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(225,29,72,0.2)] flex items-center gap-2">
                  <Plus size={14} /> Add New Feature
                </button>
              </div>

              {/* Row 2: Left Widgets (2/3) & Right Widgets (1/3) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* LEFT WIDGET COLUMN */}
                <div className="xl:col-span-2 space-y-8">
                  
                  {/* Stats Cards (2x2 Grid) */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* Website Visitors Card */}
                    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] sm:text-[10px] font-bold text-[#9CA3AF] tracking-widest uppercase leading-tight">Total Visitors</p>
                          <h4 className="text-xl sm:text-3xl font-bold text-[#111827] mt-2 sm:mt-3 font-mono">
                            {isLoading ? "..." : visitorCount.toLocaleString()}
                          </h4>
                          <span className="text-[8px] sm:text-[10px] text-emerald-600 bg-emerald-500/10 font-bold px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-2 sm:mt-3">+18.4% this week</span>
                        </div>
                        <div className="p-2 sm:p-3.5 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
                          <Activity size={16} className="sm:w-5 sm:h-5" />
                        </div>
                      </div>
                    </div>

                    {/* PDF Purchases Card */}
                    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-red" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] sm:text-[10px] font-bold text-[#9CA3AF] tracking-widest uppercase leading-tight">PDF Purchases</p>
                          <h4 className="text-xl sm:text-3xl font-bold text-[#111827] mt-2 sm:mt-3 font-mono">
                            {isLoading ? "..." : ordersData.filter(o => o.status === "APPROVED").length}
                          </h4>
                          <span className="text-[8px] sm:text-[10px] text-brand-red bg-brand-red/10 font-bold px-2 py-0.5 rounded border border-brand-red/20 inline-block mt-2 sm:mt-3">
                            Revenue: ৳{ordersData.filter(o => o.status === "APPROVED").reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2 sm:p-3.5 bg-brand-red/10 text-brand-red rounded-xl shrink-0">
                          <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Recruiter Proposals Card */}
                    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] sm:text-[10px] font-bold text-[#9CA3AF] tracking-widest uppercase leading-tight">HR Proposals</p>
                          <h4 className="text-xl sm:text-3xl font-bold text-[#111827] mt-2 sm:mt-3 font-mono">
                            {isLoading ? "..." : recruitmentProposals.length}
                          </h4>
                          <span className="text-[8px] sm:text-[10px] text-blue-600 bg-blue-500/10 font-bold px-2 py-0.5 rounded border border-blue-500/20 inline-block mt-2 sm:mt-3">
                            Pipeline Active
                          </span>
                        </div>
                        <div className="p-2 sm:p-3.5 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
                          <Award size={16} className="sm:w-5 sm:h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Total Works Card */}
                    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8B5CF6]" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[8px] sm:text-[10px] font-bold text-[#9CA3AF] tracking-widest uppercase leading-tight">Works Portfolio</p>
                          <h4 className="text-xl sm:text-3xl font-bold text-[#111827] mt-2 sm:mt-3 font-mono">
                            {isLoading ? "..." : projectsData.length}
                          </h4>
                          <span className="text-[8px] sm:text-[10px] text-[#7C3AED] bg-[#8B5CF6]/10 font-bold px-2 py-0.5 rounded border border-[#8B5CF6]/20 inline-block mt-2 sm:mt-3">
                            {activeWorks} Live online
                          </span>
                        </div>
                        <div className="p-2 sm:p-3.5 bg-[#8B5CF6]/10 text-[#7C3AED] rounded-xl shrink-0">
                          <FolderKanban size={16} className="sm:w-5 sm:h-5" />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Output Timeline */}
                  <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                    <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#111827] font-serif">Creative Output Timeline</h4>
                        <p className="text-[10px] text-[#9CA3AF] font-bold tracking-wider mt-0.5">TRACK DYNAMIC PORTFOLIO RELEASES</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#E11D48] bg-[#E11D48]/10 px-3 py-1 rounded-full border border-brand-red/10 font-mono">THIS YEAR</span>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-3 pt-6 px-4">
                      {[
                        { month: "Jan", val: "40%", count: 2 },
                        { month: "Feb", val: "70%", count: 4 },
                        { month: "Mar", val: "55%", count: 3 },
                        { month: "Apr", val: "90%", count: 6 },
                        { month: "May", val: "30%", count: 1 },
                        { month: "Jun", val: "65%", count: 3 },
                        { month: "Jul", val: "85%", count: 5 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full group/bar cursor-pointer">
                          <div className="w-full flex-1 bg-[#F8FAFC] rounded-t-xl overflow-hidden flex items-end relative border border-[#E2E8F0]">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: item.val }}
                              transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                              className="w-full bg-brand-red rounded-t-xl relative group-hover/bar:bg-blood-red transition-all shadow-[0_0_10px_rgba(255,0,0,0.05)] flex items-start justify-center pt-2"
                            >
                              <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity text-[8px] font-bold text-white font-mono">{item.count}</span>
                            </motion.div>
                          </div>
                          <span className="text-[10px] text-[#9CA3AF] group-hover/bar:text-[#111827] transition-colors font-bold font-mono">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* RIGHT WIDGET COLUMN */}
                <div className="space-y-8">
                  
                  {/* Concentric Rings Category Breakdown Chart */}
                  <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] font-serif">Portfolio Breakdown</h4>
                      <p className="text-[10px] text-[#9CA3AF] font-bold tracking-wider mt-0.5">CATEGORICAL SYSTEM ANALYSIS</p>
                    </div>

                    {/* SVG Progress Rings */}
                    <div className="relative w-44 h-44 mx-auto my-8 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="88" cy="88" r="70" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                        <motion.circle 
                          cx="88" cy="88" r="70" stroke="#E11D48" strokeWidth="8" fill="transparent" 
                          strokeDasharray={440}
                          initial={{ strokeDashoffset: 440 }}
                          animate={{ strokeDashoffset: 440 - (440 * motionPercent) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />

                        <circle cx="88" cy="88" r="50" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                        <motion.circle 
                          cx="88" cy="88" r="50" stroke="#3B82F6" strokeWidth="8" fill="transparent" 
                          strokeDasharray={314}
                          initial={{ strokeDashoffset: 314 }}
                          animate={{ strokeDashoffset: 314 - (314 * graphicPercent) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        />

                        <circle cx="88" cy="88" r="30" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                        <motion.circle 
                          cx="88" cy="88" r="30" stroke="#10B981" strokeWidth="8" fill="transparent" 
                          strokeDasharray={188}
                          initial={{ strokeDashoffset: 188 }}
                          animate={{ strokeDashoffset: 188 - (188 * otherPercent) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                        />
                      </svg>
                      
                      <div className="absolute text-center flex flex-col items-center">
                        <span className="text-xl font-bold font-mono text-[#111827]">{totalWorks}</span>
                        <span className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-0.5">Total Assets</span>
                      </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="space-y-3 border-t border-[#F1F5F9] pt-4 text-xs font-semibold">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                          <span className="text-[#4B5563]">Motion Design</span>
                        </div>
                        <span className="font-mono text-[#111827]">{motionPercent}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                          <span className="text-[#4B5563]">Graphic Design</span>
                        </div>
                        <span className="font-mono text-[#111827]">{graphicPercent}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                          <span className="text-[#4B5563]">Illustrations</span>
                        </div>
                        <span className="font-mono text-[#111827]">{otherPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* System Diagnostics */}
                  <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] font-serif">System Diagnostics</h4>
                      <p className="text-[10px] text-[#9CA3AF] font-bold tracking-wider mt-0.5">LIVE HOST METADATA CLOUD MONITOR</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { title: "Server CPU Load", val: "18%", color: "bg-emerald-500" },
                        { title: "Memory Allocation", val: "42%", color: "bg-blue-500" },
                        { title: "Disk Repository Space", val: "68%", color: "bg-brand-red" }
                      ].map((diagnostic, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-[#4B5563]">{diagnostic.title}</span>
                            <span className="font-mono text-[#111827]">{diagnostic.val}</span>
                          </div>
                          <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: diagnostic.val }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              className={`h-full ${diagnostic.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DETAILED PROJECTS FULL CRUD SYSTEM */}
          {activeTab === "projects" && (
            <div className="flex flex-col gap-6 flex-1 min-h-0 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Portfolio Management</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Execute secure full-scope operations (CRUD) on frontend assets.</p>
                </div>
                <button onClick={handleAddNew} className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blood-red transition-all text-xs shadow-[0_4px_12px_rgba(225,29,72,0.15)]">
                  <Plus size={14} /> Add New Feature
                </button>
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by Title or Slug ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none text-[#111827] transition-all font-semibold"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
                    <Filter size={14} className="text-[#9CA3AF]" />
                    <select 
                      value={categoryFilter} 
                      onChange={e => setCategoryFilter(e.target.value)}
                      className="bg-transparent border-none text-[10px] text-[#4B5563] outline-none font-bold cursor-pointer"
                    >
                      <option value="all">ALL CATEGORIES</option>
                      {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
                    <span className="text-[10px] text-[#9CA3AF] font-bold">STATUS:</span>
                    <select 
                      value={statusFilter} 
                      onChange={e => setStatusFilter(e.target.value as any)}
                      className="bg-transparent border-none text-[10px] text-[#4B5563] outline-none font-bold cursor-pointer"
                    >
                      <option value="all">ALL STATES</option>
                      <option value="active">ACTIVE ONLY</option>
                      <option value="inactive">INACTIVE ONLY</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BULK ACTIONS BAR */}
              <AnimatePresence>
                {selectedIds.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden shrink-0"
                  >
                    <div className="bg-[#FFF1F2] border border-brand-red/20 p-3 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="text-[10px] text-[#111827] font-bold flex items-center gap-2 pl-2">
                        <CheckCircle size={14} className="text-brand-red animate-pulse" />
                        {selectedIds.length} assets selected for batch execution
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleBulkToggleStatus(true)}
                          className="bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          Set Active
                        </button>
                        <button 
                          onClick={() => handleBulkToggleStatus(false)}
                          className="bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          Set Inactive
                        </button>
                        <button 
                          onClick={handleBulkDelete}
                          className="bg-brand-red hover:bg-blood-red text-white text-[10px] font-bold px-4 py-1.5 rounded-xl transition-all shadow-[0_2px_8px_rgba(255,0,0,0.15)]"
                        >
                          Bulk Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DATA TABLE */}
              <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden flex flex-col min-h-0 relative shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[9px] tracking-[0.2em] font-bold text-[#9CA3AF] uppercase">
                        <th className="py-4 px-6 w-[50px] text-center">
                          <input 
                            type="checkbox" 
                            checked={filteredProjects.length > 0 && selectedIds.length === filteredProjects.length}
                            onChange={handleSelectAll}
                            className="accent-brand-red w-4 h-4 rounded cursor-pointer"
                          />
                        </th>
                        <th className="py-4 px-4 w-[160px]">ID Slug</th>
                        <th className="py-4 px-4 w-[280px]">Feature Title</th>
                        <th className="py-4 px-4 w-[200px]">Asset / Platform</th>
                        <th className="py-4 px-4 w-[120px] text-center">Featured</th>
                        <th className="py-4 px-4 w-[120px] text-center">Status</th>
                        <th className="py-4 px-4 w-[140px] text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-xs text-[#4B5563] font-semibold">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                          <tr key={idx} className="animate-pulse">
                            <td className="py-4 px-6 text-center"><div className="w-4 h-4 bg-[#E2E8F0] rounded mx-auto" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-24" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-44" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-32" /></td>
                            <td className="py-4 px-4"><div className="h-6 bg-[#E2E8F0] rounded w-16 mx-auto" /></td>
                            <td className="py-4 px-4"><div className="h-6 bg-[#E2E8F0] rounded w-16 mx-auto" /></td>
                            <td className="py-4 px-4 text-right pr-8"><div className="h-8 bg-[#E2E8F0] rounded w-20 ml-auto" /></td>
                          </tr>
                        ))
                      ) : filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-16 text-center text-[#9CA3AF] font-medium font-mono">
                            NO FEATURE ROWS MATCHED CRITERIA
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map(project => {
                          const isSelected = selectedIds.includes(project.id);
                          return (
                            <tr 
                              key={project.id} 
                              className={`hover:bg-[#F8FAFC] transition-colors group ${isSelected ? "bg-brand-red/5" : ""}`}
                            >
                              <td className="py-4 px-6 text-center">
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => handleSelectRow(project.id)}
                                  className="accent-brand-red w-4 h-4 rounded cursor-pointer"
                                />
                              </td>
                              
                              <td className="py-4 px-4 font-mono text-[#9CA3AF]">
                                {project.slug}
                              </td>

                              <td className="py-4 px-4 font-bold text-[#111827]">
                                <span className="block line-clamp-1">{project.title}</span>
                                <span className="text-[9px] text-[#E11D48] font-bold uppercase tracking-wider block mt-0.5 font-mono">{project.catId}</span>
                              </td>

                              <td className="py-4 px-4 text-xs font-mono text-[#6B7280]">
                                <div className="flex items-center gap-2">
                                  {project.videoUrl ? (
                                    <>
                                      <Video size={13} className="text-[#4B5563]" />
                                      <span className="truncate text-[#4B5563] max-w-[150px]">{project.videoUrl}</span>
                                    </>
                                  ) : (
                                    <>
                                      <ImageIcon size={13} />
                                      <span className="truncate max-w-[150px]">{project.image}</span>
                                    </>
                                  )}
                                </div>
                              </td>

                              <td className="py-4 px-4 text-center">
                                <button 
                                  onClick={() => handleToggleFeatured(project)}
                                  className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded transition-all border ${
                                    project.isFeatured 
                                      ? "bg-brand-red/10 border-brand-red/20 text-brand-red" 
                                      : "bg-[#F1F5F9] border-transparent text-[#9CA3AF] hover:text-[#4B5563]"
                                  }`}
                                >
                                  {project.isFeatured ? "FEATURED" : "NORMAL"}
                                </button>
                              </td>

                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={() => handleToggleStatus(project)}
                                  className={`px-3 py-1 text-xs rounded-full font-bold transition-all border ${
                                    project.isActive 
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
                                      : "bg-[#F1F5F9] border-transparent text-[#9CA3AF] hover:text-[#4B5563]"
                                  }`}
                                >
                                  {project.isActive ? "Active" : "Inactive"}
                                </button>
                              </td>

                              <td className="py-4 px-4 text-right pr-8">
                                <div className="flex justify-end gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => {
                                      setEditingProject({ ...project });
                                      setFormErrors({});
                                    }}
                                    className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#4B5563] rounded-xl hover:border-brand-red hover:text-brand-red transition-all shadow-sm"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteIndividual(project)}
                                    className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-red-500 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-sm"
                                  >
                                    <Trash2 size={12} />
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
              </div>

            </div>
          )}

          {/* TAB 3: DIGITAL SHOP MANAGEMENT (CRUD TABLE FOR PRODUCTS) */}
          {activeTab === "shop" && (
            <div className="flex flex-col gap-6 flex-1 min-h-0 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Digital Shop Catalog</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Configure downloadable PDF books, storytelling frameworks, and visual guides.</p>
                </div>
                <button onClick={handleAddNewProduct} className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blood-red transition-all text-xs shadow-[0_4px_12px_rgba(225,29,72,0.15)]">
                  <Plus size={14} /> Add PDF Book
                </button>
              </div>

              {/* SEARCH & FILTER FOR SHOP */}
              <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search products by Title or Description..."
                    value={productQuery}
                    onChange={e => setProductQuery(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-brand-red outline-none text-[#111827] transition-all font-semibold"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
                    <span className="text-[10px] text-[#9CA3AF] font-bold">STATUS:</span>
                    <select 
                      value={productStatusFilter} 
                      onChange={e => setProductStatusFilter(e.target.value as any)}
                      className="bg-transparent border-none text-[10px] text-[#4B5563] outline-none font-bold cursor-pointer"
                    >
                      <option value="all">ALL STATES</option>
                      <option value="active">ACTIVE ONLY</option>
                      <option value="inactive">INACTIVE ONLY</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BULK ACTION PANEL FOR PRODUCTS */}
              <AnimatePresence>
                {selectedProductIds.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden shrink-0"
                  >
                    <div className="bg-[#FFF1F2] border border-brand-red/20 p-3 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="text-[10px] text-[#111827] font-bold flex items-center gap-2 pl-2">
                        <CheckCircle size={14} className="text-brand-red animate-pulse" />
                        {selectedProductIds.length} products selected for batch execution
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleBulkToggleProductStatus(true)}
                          className="bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          Set Live (Active)
                        </button>
                        <button 
                          onClick={() => handleBulkToggleProductStatus(false)}
                          className="bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          Set Inactive
                        </button>
                        <button 
                          onClick={handleBulkDeleteProducts}
                          className="bg-brand-red hover:bg-blood-red text-white text-[10px] font-bold px-4 py-1.5 rounded-xl transition-all shadow-[0_2px_8px_rgba(255,0,0,0.15)]"
                        >
                          Bulk Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DATA TABLE FOR DIGITAL SHOP */}
              <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden flex flex-col min-h-0 relative shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[9px] tracking-[0.2em] font-bold text-[#9CA3AF] uppercase">
                        <th className="py-4 px-6 w-[50px] text-center">
                          <input 
                            type="checkbox" 
                            checked={filteredProductsData.length > 0 && selectedProductIds.length === filteredProductsData.length}
                            onChange={handleSelectAllProducts}
                            className="accent-brand-red w-4 h-4 rounded cursor-pointer"
                          />
                        </th>
                        <th className="py-4 px-4 w-[240px]">Book Title</th>
                        <th className="py-4 px-4 w-[140px]">Retail Price</th>
                        <th className="py-4 px-4 w-[280px]">Downloadeable PDF link</th>
                        <th className="py-4 px-4 w-[120px] text-center">Status</th>
                        <th className="py-4 px-4 w-[140px] text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-xs text-[#4B5563] font-semibold">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                          <tr key={idx} className="animate-pulse">
                            <td className="py-4 px-6 text-center"><div className="w-4 h-4 bg-[#E2E8F0] rounded mx-auto" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-44" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-16" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-52" /></td>
                            <td className="py-4 px-4"><div className="h-6 bg-[#E2E8F0] rounded w-16 mx-auto" /></td>
                            <td className="py-4 px-4 text-right pr-8"><div className="h-8 bg-[#E2E8F0] rounded w-20 ml-auto" /></td>
                          </tr>
                        ))
                      ) : filteredProductsData.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-[#9CA3AF] font-medium font-mono">
                            NO PDF PRODUCTS REGISTERED IN DIGITAL STORE
                          </td>
                        </tr>
                      ) : (
                        filteredProductsData.map(product => {
                          const isSelected = selectedProductIds.includes(product.id);
                          return (
                            <tr 
                              key={product.id} 
                              className={`hover:bg-[#F8FAFC] transition-colors group ${isSelected ? "bg-brand-red/5" : ""}`}
                            >
                              <td className="py-4 px-6 text-center">
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => handleSelectProductRow(product.id)}
                                  className="accent-brand-red w-4 h-4 rounded cursor-pointer"
                                />
                              </td>
                              
                              <td className="py-4 px-4 font-bold text-[#111827]">
                                <span className="block line-clamp-1">{product.title}</span>
                              </td>

                              <td className="py-4 px-4 font-mono font-bold text-brand-red">
                                ৳ {product.price.toLocaleString()}
                              </td>

                              <td className="py-4 px-4 text-xs font-mono text-[#9CA3AF]">
                                <div className="flex items-center gap-2">
                                  <FileText size={13} className="text-[#6B7280]" />
                                  <span className="truncate max-w-[240px]">{product.pdfUrl}</span>
                                </div>
                              </td>

                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={() => handleToggleProductStatus(product)}
                                  className={`px-3 py-1 text-xs rounded-full font-bold transition-all border ${
                                    product.isActive 
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
                                      : "bg-[#F1F5F9] border-transparent text-[#9CA3AF] hover:text-[#4B5563]"
                                  }`}
                                >
                                  {product.isActive ? "Active" : "Inactive"}
                                </button>
                              </td>

                              <td className="py-4 px-4 text-right pr-8">
                                <div className="flex justify-end gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => {
                                      setEditingProduct({ ...product });
                                      setFormErrors({});
                                    }}
                                    className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#4B5563] rounded-xl hover:border-brand-red hover:text-brand-red transition-all shadow-sm"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(product)}
                                    className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-red-500 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-sm"
                                  >
                                    <Trash2 size={12} />
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
              </div>

            </div>
          )}
          {/* TAB 6: DYNAMIC ORDERS CONSOLE (REAL-TIME PAYMENT VERIFIER) */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-6 flex-1 min-h-0 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Orders Console</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Verify manual mobile banking ledger payments (bKash/Nagad TrxID) and approve premium PDF delivery.</p>
                </div>
                <button 
                  onClick={fetchData} 
                  className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blood-red transition-all text-xs shadow-[0_4px_12px_rgba(225,29,72,0.15)]"
                >
                  <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Sync Ledger
                </button>
              </div>

              {/* Sub tab controls */}
              <div className="flex border-b border-[#E2E8F0] gap-4 shrink-0 font-mono text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveSubTab("orders")}
                  className={`pb-3 px-2 border-b-2 transition-all ${
                    activeSubTab === "orders" 
                      ? "border-brand-red text-brand-red font-black" 
                      : "border-transparent text-[#9CA3AF] hover:text-[#4B5563]"
                  }`}
                >
                  📥 Orders Ledger ({filteredOrders.length})
                </button>
                <button
                  onClick={() => setActiveSubTab("emails")}
                  className={`pb-3 px-2 border-b-2 transition-all ${
                    activeSubTab === "emails" 
                      ? "border-brand-red text-brand-red font-black" 
                      : "border-transparent text-[#9CA3AF] hover:text-[#4B5563]"
                  }`}
                >
                  📤 Outbox Email Simulation ({emailLogs.length})
                </button>
              </div>

              {activeSubTab === "orders" && (
                <>
                  {/* SEARCH & FILTERS BAR FOR ORDERS */}
                  <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search orders by Name, Phone, Book Title, or TrxID..."
                        value={orderQuery}
                        onChange={e => setOrderQuery(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-brand-red outline-none text-[#111827] transition-all font-semibold"
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
                        <span className="text-[10px] text-[#9CA3AF] font-bold">STATUS:</span>
                        <select 
                          value={orderStatusFilter} 
                          onChange={e => setOrderStatusFilter(e.target.value as any)}
                          className="bg-transparent border-none text-[10px] text-[#4B5563] outline-none font-bold cursor-pointer"
                        >
                          <option value="all">ALL TRANSACTIONS</option>
                          <option value="PENDING">PENDING ONLY</option>
                          <option value="APPROVED">APPROVED ONLY</option>
                          <option value="REJECTED">REJECTED ONLY</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* BULK ACTIONS PANEL FOR ORDERS */}
                  <AnimatePresence>
                    {selectedOrderIds.length > 0 && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden shrink-0"
                      >
                        <div className="bg-[#FFF1F2] border border-brand-red/20 p-3 rounded-2xl flex items-center justify-between shadow-sm">
                          <div className="text-[10px] text-[#111827] font-bold flex items-center gap-2 pl-2">
                            <CheckCircle size={14} className="text-brand-red animate-pulse" />
                            {selectedOrderIds.length} orders selected for batch processing
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleBulkUpdateOrders("APPROVED")}
                              className="bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] text-[10px] font-bold px-4 py-1.5 rounded-xl transition-all shadow-sm"
                            >
                              Approve Selected
                            </button>
                            <button 
                              onClick={() => handleBulkUpdateOrders("REJECTED")}
                              className="bg-brand-red hover:bg-blood-red text-white text-[10px] font-bold px-4 py-1.5 rounded-xl transition-all shadow-[0_2px_8px_rgba(255,0,0,0.15)]"
                            >
                              Reject Selected
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* DATA TABLE FOR ORDERS */}
                  <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden flex flex-col min-h-0 relative shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                    <div className="flex-1 overflow-auto">
                      <table className="w-full text-left border-collapse min-w-[800px] table-fixed">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[9px] tracking-[0.2em] font-bold text-[#9CA3AF] uppercase">
                            <th className="py-4 px-6 w-[50px] text-center">
                              <input 
                                type="checkbox" 
                                checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                                onChange={handleSelectAllOrders}
                                className="accent-brand-red w-4 h-4 rounded cursor-pointer"
                              />
                            </th>
                            <th className="py-4 px-4 w-[220px]">Client / Info</th>
                            <th className="py-4 px-4 w-[240px]">Purchased Resource</th>
                            <th className="py-4 px-4 w-[160px]">Transaction ID</th>
                            <th className="py-4 px-4 w-[120px] text-center">Status</th>
                            <th className="py-4 px-4 w-[160px] text-right pr-8">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0] text-xs text-[#4B5563] font-semibold">
                          {isLoading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                              <tr key={idx} className="animate-pulse">
                                <td className="py-4 px-6 text-center"><div className="w-4 h-4 bg-[#E2E8F0] rounded mx-auto" /></td>
                                <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-32" /></td>
                                <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-44" /></td>
                                <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-24" /></td>
                                <td className="py-4 px-4"><div className="h-6 bg-[#E2E8F0] rounded w-16 mx-auto" /></td>
                                <td className="py-4 px-4 text-right pr-8"><div className="h-8 bg-[#E2E8F0] rounded w-28 ml-auto" /></td>
                              </tr>
                            ))
                          ) : filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-16 text-center text-[#9CA3AF] font-medium font-mono">
                                NO ORDERS LOGGED IN TRANSACTION LEDGER
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map(order => {
                              const isSelected = selectedOrderIds.includes(order.id);
                              return (
                                <tr 
                                  key={order.id} 
                                  className={`hover:bg-[#F8FAFC] transition-colors group ${isSelected ? "bg-brand-red/5" : ""}`}
                                >
                                  <td className="py-4 px-6 text-center">
                                    <input 
                                      type="checkbox" 
                                      checked={isSelected}
                                      onChange={() => handleSelectOrderRow(order.id)}
                                      className="accent-brand-red w-4 h-4 rounded cursor-pointer"
                                    />
                                  </td>
                                  
                                  <td className="py-4 px-4">
                                    <span className="block text-[#111827] font-bold">{order.clientName}</span>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 font-mono">
                                      <span className="text-[10px] text-[#6B7280]">{order.clientPhone}</span>
                                      {order.whatsappNumber && (
                                        <a 
                                          href={`https://wa.me/${order.whatsappNumber.replace(/[^0-9]/g, "")}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[8px] font-bold uppercase"
                                          title="Click to Chat on WhatsApp"
                                        >
                                          <MessageCircle size={8} /> WhatsApp
                                        </a>
                                      )}
                                    </div>
                                    {order.clientEmail && (
                                      <span className="block text-[10px] text-[#3B82F6] hover:underline mt-0.5 font-mono truncate">{order.clientEmail}</span>
                                    )}
                                  </td>

                                  <td className="py-4 px-4">
                                    <span className="block text-[#111827] font-bold line-clamp-1">{order.productTitle}</span>
                                    <span className="block text-[10px] text-brand-red font-bold font-mono mt-0.5">৳ {order.price.toLocaleString()}</span>
                                  </td>

                                  <td className="py-4 px-4">
                                    <span className="block text-[#111827] font-bold font-mono tracking-wider">{order.trxId}</span>
                                    <span className="block text-[9px] text-[#9CA3AF] uppercase font-bold mt-0.5 font-mono">{order.paymentMethod}</span>
                                  </td>

                                  <td className="py-4 px-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1.5 ${
                                      order.status === "APPROVED" 
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
                                        : order.status === "REJECTED" 
                                          ? "bg-red-500/10 border-red-500/20 text-red-600"
                                          : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                                    }`}>
                                      {order.status === "PENDING" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
                                      {order.status}
                                    </span>
                                  </td>

                                  <td className="py-4 px-4 text-right pr-8">
                                    {order.status === "PENDING" ? (
                                      <div className="flex justify-end gap-1.5">
                                        <button 
                                          disabled={isUpdatingOrder}
                                          onClick={() => handleUpdateOrderStatus(order.id, "APPROVED")}
                                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] shadow-sm transition-all"
                                        >
                                          Approve
                                        </button>
                                        <button 
                                          disabled={isUpdatingOrder}
                                          onClick={() => handleUpdateOrderStatus(order.id, "REJECTED")}
                                          className="px-3 py-1.5 bg-brand-red hover:bg-blood-red text-white rounded-lg font-bold text-[10px] shadow-sm transition-all"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="text-[10px] text-muted font-bold font-mono">
                                        VERIFIED {new Date(order.createdAt).toLocaleDateString()}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {activeSubTab === "emails" && (
                <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-0">
                  {/* Left List of Sent Emails */}
                  <div className="w-full lg:w-1/3 bg-white border border-[#E2E8F0] rounded-3xl p-6 flex flex-col gap-4 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] shrink-0">
                    <div className="shrink-0">
                      <h4 className="text-sm font-bold text-[#111827] font-serif">Sent Mail Outbox</h4>
                      <p className="text-[9px] text-[#9CA3AF] font-bold tracking-widest font-mono uppercase mt-0.5">MOCK SMTP DELIVERIES</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 font-semibold text-xs pr-1">
                      {emailLogs.length === 0 ? (
                        <div className="py-12 text-center text-[#9CA3AF] font-mono">
                          NO SENT EMAIL LOGS RECORDED
                        </div>
                      ) : (
                        emailLogs.map(log => (
                          <button
                            key={log.id}
                            onClick={() => setSelectedEmail(log)}
                            className={`w-full text-left p-3.5 border rounded-2xl transition-all flex flex-col gap-1.5 ${
                              selectedEmail?.id === log.id 
                                ? "bg-brand-red/5 border-brand-red/35" 
                                : "bg-white border-[#E2E8F0] hover:border-brand-red/30 hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <div className="flex justify-between items-center w-full font-mono text-[9px] text-[#9CA3AF]">
                              <span className="font-bold truncate max-w-[100px]">{log.trxId}</span>
                              <span>{new Date(log.sentAt).toLocaleTimeString()}</span>
                            </div>
                            <span className="block text-[#111827] font-bold truncate">{log.clientName}</span>
                            <span className="block text-[10px] text-muted truncate">{log.to}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Live Email Viewer Screen */}
                  <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl p-8 flex flex-col gap-6 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
                    {selectedEmail ? (
                      <div className="flex flex-col h-full overflow-hidden">
                        {/* Header Details */}
                        <div className="border-b border-[#F1F5F9] pb-4 shrink-0 space-y-2.5 text-xs font-semibold">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF] font-mono">Outgoing Email Viewer</span>
                            <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-md font-bold font-mono">STATUS: DELIVERED (SIMULATED)</span>
                          </div>
                          <div>
                            <span className="text-[#9CA3AF] font-mono">To:</span> <strong className="text-[#111827]">{selectedEmail.clientName}</strong> <span className="text-[#6B7280] font-mono">&lt;{selectedEmail.to}&gt;</span>
                          </div>
                          <div>
                            <span className="text-[#9CA3AF] font-mono">Subject:</span> <strong className="text-[#111827]">{selectedEmail.subject}</strong>
                          </div>
                          <div className="text-[10px] text-[#9CA3AF] font-mono">
                            Sent at: {new Date(selectedEmail.sentAt).toLocaleString()}
                          </div>
                        </div>

                        {/* HTML Render Frame container */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9F6] border border-[#F1F5F9] rounded-2xl mt-4">
                          <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto space-y-4">
                        <Mail size={40} className="text-brand-red/35 animate-bounce" />
                        <h4 className="text-base font-bold text-[#111827] font-serif">Simulated Email Inspector</h4>
                        <p className="text-xs text-[#6B7280] leading-relaxed font-semibold">
                          Select any outgoing delivery receipt from the left sidebar queue to inspect its HTML brand styling, recipient variables, and download access links.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ESTIMATOR SETTINGS TAB */}
          {activeTab === "estimator" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Header */}
              <div className="flex justify-between items-end border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Estimator Pricing Matrix</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Alter baseline rates, scope multiplier options, and delivery timelines instantly.</p>
                </div>
                <button 
                  onClick={handleSaveCalculator} 
                  disabled={isSavingCalculator}
                  className="bg-brand-red hover:bg-blood-red text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(225,29,72,0.2)] flex items-center gap-2"
                >
                  {isSavingCalculator ? "Saving..." : <><Save size={14} /> Commit Changes</>}
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* 1. Branding Pricing Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                  <h4 className="text-sm font-bold text-white bg-brand-red px-3 py-1.5 rounded-xl inline-block">🦄 Branding Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Branding base price (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.brandingBase} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, brandingBase: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Extra Logo Concept Cost (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.brandingLogoExtra} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, brandingLogoExtra: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Guidelines Rulebook Cost (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.brandingGuidelines} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, brandingGuidelines: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Social Media Kit Cost (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.brandingSocial} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, brandingSocial: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Stationery Design Cost (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.brandingStationery} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, brandingStationery: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Motion Pricing Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                  <h4 className="text-sm font-bold text-white bg-blue-500 px-3 py-1.5 rounded-xl inline-block">🍿 Motion Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Motion Base price (15s) (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.motionBase} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, motionBase: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Extra Duration (per 5s) (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.motionDurationExtra} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, motionDurationExtra: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Advanced 3D Style Extra (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.motionStyle3dExtra} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, motionStyle3dExtra: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Studio Voiceover Recording (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.motionVoiceover} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, motionVoiceover: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Custom Sound design / SFX (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.motionSfx} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, motionSfx: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. UI/UX Pricing Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                  <h4 className="text-sm font-bold text-white bg-emerald-500 px-3 py-1.5 rounded-xl inline-block">🕹️ UI/UX Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">UI/UX Base price (5 Screens) (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.uiuxBase} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, uiuxBase: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Extra screen price (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.uiuxScreenExtra} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, uiuxScreenExtra: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Interactive Prototype (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.uiuxPrototype} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, uiuxPrototype: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Comprehensive Design System (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.uiuxDesignSystem} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, uiuxDesignSystem: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Responsive mobile/tablet layouts (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.uiuxResponsive} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, uiuxResponsive: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Illustration Pricing Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                  <h4 className="text-sm font-bold text-white bg-amber-500 px-3 py-1.5 rounded-xl inline-block">✍️ Illustration Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Illustration Base Price (3 custom) (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.illustrationBase || 15000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, illustrationBase: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Extra Illustration Cost (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.illustrationExtra || 3000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, illustrationExtra: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Character Mascot Design Sheet (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.illustrationCharacterDesign || 8000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, illustrationCharacterDesign: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Professional Storyboard Sheets (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.illustrationStoryboard || 10000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, illustrationStoryboard: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Vector Raw Asset Handoff (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.illustrationVectorHandoff || 5000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, illustrationVectorHandoff: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Creative Direction Pricing Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
                  <h4 className="text-sm font-bold text-white bg-violet-500 px-3 py-1.5 rounded-xl inline-block">✨ Creative Direction Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Creative Direction Base (1 Day) (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.creativeDirectionBase || 50000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, creativeDirectionBase: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Extra Event Duration (per Day) (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.creativeDirectionDayExtra || 10000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, creativeDirectionDayExtra: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Exhibition 3D Space Layout (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.creativeDirection3dMapping || 25000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, creativeDirection3dMapping: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Promotional Print Collaterals (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.creativeDirectionPrintCollaterals || 15000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, creativeDirectionPrintCollaterals: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Curation & PR Consulting (৳)</label>
                      <input 
                        type="number" 
                        value={calculatorConfig.creativeDirectionCurationConsulting || 20000} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, creativeDirectionCurationConsulting: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Timeline Multiplier Settings */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white bg-orange-500 px-3 py-1.5 rounded-xl inline-block">⚡ Delivery timeline multipliers</h4>
                    <div className="mt-6 text-xs font-bold">
                      <label className="block text-[#9CA3AF] mb-2 uppercase tracking-wider text-[9px]">Rush Delivery Multiplier (Warp Speed)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={calculatorConfig.timelineRushMultiplier} 
                        onChange={e => setCalculatorConfig({ ...calculatorConfig, timelineRushMultiplier: parseFloat(e.target.value) || 1.0 })}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[#111827] outline-none focus:border-brand-red font-mono"
                      />
                      <p className="text-[10px] text-[#9CA3AF] font-semibold mt-2.5 leading-relaxed">
                        e.g., 1.3 means a 30% increase on budget for rush deliveries. 1.0 means no extra delivery fee.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-6 flex justify-end gap-3 mt-8">
                    <button 
                      onClick={handleSaveCalculator} 
                      disabled={isSavingCalculator}
                      className="w-full bg-brand-red hover:bg-blood-red text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(225,29,72,0.15)]"
                    >
                      {isSavingCalculator ? "Committing..." : <><Save size={14} /> Save Pricing Matrix</>}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: RECRUITER PROPOSALS VIEWER */}
          {activeTab === "recruitment" && (
            <div className="flex flex-col gap-6 flex-1 min-h-0 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Recruitment Pipeline</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Monitor, verify, and follow up on official creative brief proposals delivered by HR Managers.</p>
                </div>
                <button 
                  onClick={fetchData} 
                  className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blood-red transition-all text-xs shadow-[0_4px_12px_rgba(225,29,72,0.15)]"
                >
                  <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh Pipeline
                </button>
              </div>

              {/* DATA TABLE */}
              <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden flex flex-col min-h-0 relative shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[9px] tracking-[0.2em] font-bold text-[#9CA3AF] uppercase">
                        <th className="py-4 px-6 w-[200px]">Company & HR Name</th>
                        <th className="py-4 px-4 w-[200px]">Official Contacts</th>
                        <th className="py-4 px-4 w-[160px]">Employment & Package</th>
                        <th className="py-4 px-4 w-[380px]">Job Description & Brief</th>
                        <th className="py-4 px-4 w-[140px] text-center">Received Date</th>
                        <th className="py-4 px-4 w-[120px] text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-xs text-[#4B5563] font-semibold">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                          <tr key={idx} className="animate-pulse">
                            <td className="py-4 px-6"><div className="h-4 bg-[#E2E8F0] rounded w-32" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-28" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-20" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-72" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-24 mx-auto" /></td>
                            <td className="py-4 px-4 text-right pr-8"><div className="h-8 bg-[#E2E8F0] rounded w-16 ml-auto" /></td>
                          </tr>
                        ))
                      ) : recruitmentProposals.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-[#9CA3AF] font-medium font-mono">
                            NO RECRUITER BRIEF PROPOSALS RECEIVED YET
                          </td>
                        </tr>
                      ) : (
                        recruitmentProposals.map(proposal => (
                          <tr key={proposal.id} className="hover:bg-[#F8FAFC] transition-colors group">
                            <td className="py-4 px-6 font-bold text-[#111827]">
                              <span className="block">{proposal.companyName}</span>
                              <span className="text-[9px] text-[#E11D48] font-bold uppercase tracking-wider block mt-0.5 font-mono">HR: {proposal.hrName}</span>
                            </td>

                            <td className="py-4 px-4 font-mono">
                              <span className="block text-[#111827] truncate font-bold">{proposal.email}</span>
                              <span className="block text-[10px] text-[#6B7280] font-bold mt-0.5">{proposal.phone}</span>
                            </td>

                            <td className="py-4 px-4 uppercase text-[10px] font-mono font-bold">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider block w-fit border ${
                                proposal.positionType === 'full-time' 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                                  : proposal.positionType === 'contract'
                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-600'
                                    : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
                              }`}>
                                {proposal.positionType}
                              </span>
                              <span className="block text-[10px] text-brand-red font-bold font-mono mt-1.5 lowercase">
                                {proposal.offeredRange === 'entry' ? '৳35k-৳50k' : proposal.offeredRange === 'medium' ? '৳50k-৳90k' : '৳90k+ or Custom'}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-xs">
                              <div className="bg-[#EEEDF2]/40 border border-[#E2E8F0] p-3.5 rounded-2xl max-h-[120px] overflow-y-auto font-light leading-relaxed whitespace-pre-wrap text-[#4B5563]">
                                {proposal.jobDescription}
                              </div>
                            </td>

                            <td className="py-4 px-4 text-center text-[10px] text-[#9CA3AF] font-bold font-mono">
                              {new Date(proposal.createdAt).toLocaleDateString()} <br />
                              <span className="font-normal text-[9px]">{new Date(proposal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </td>

                            <td className="py-4 px-4 text-right pr-8">
                              <div className="flex justify-end gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${proposal.companyName} HR ${proposal.hrName} - ${proposal.email} | ${proposal.phone}`);
                                    addToast("Recruiter contacts copied!", "success");
                                  }}
                                  className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#4B5563] rounded-xl hover:border-brand-red hover:text-brand-red transition-all shadow-sm"
                                  title="Copy Contact Info"
                                >
                                  <Copy size={12} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteRecruitment(proposal.id)}
                                  className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-red-500 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-sm"
                                  title="Delete Brief"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: CONTENT CALENDAR VIEW */}
          {activeTab === "calendar" && (
            <div className="flex flex-col gap-6 flex-1 min-h-0 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Content Schedule Calendar</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Organize production deadlines, client schedules, and track sudden boss requirements.</p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      const todayStr = new Date().toISOString().split('T')[0];
                      handleAddQuickBossTask(todayStr);
                    }}
                    className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blood-red transition-all text-xs shadow-[0_4px_12px_rgba(225,29,72,0.25)] animate-pulse"
                  >
                    <AlertCircle size={14} /> 🚨 Log Sudden Boss Request
                  </button>
                </div>
              </div>

              {/* FILTER & SEARCH BAR */}
              <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono">Month View:</span>
                  <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => setCurrentCalendarDate(new Date(calendarYear, calendarMonth - 1, 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono text-[#4B5563] hover:bg-brand-red hover:text-white transition-all"
                    >
                      ◀
                    </button>
                    <div className="px-4 flex items-center text-xs font-bold font-serif text-[#111827]">
                      {currentCalendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </div>
                    <button 
                      onClick={() => setCurrentCalendarDate(new Date(calendarYear, calendarMonth + 1, 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono text-[#4B5563] hover:bg-brand-red hover:text-white transition-all"
                    >
                      ▶
                    </button>
                  </div>
                  <button 
                    onClick={() => setCurrentCalendarDate(new Date())}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#4B5563] text-xs font-bold px-3 py-2 rounded-xl hover:border-brand-red hover:text-[#111827] transition-all shadow-sm"
                  >
                    Today
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Filter Priority */}
                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
                    <span className="text-[10px] text-[#9CA3AF] font-bold">PRIORITY:</span>
                    <select 
                      value={calendarFilterPriority} 
                      onChange={e => setCalendarFilterPriority(e.target.value)}
                      className="bg-transparent border-none text-[10px] text-[#4B5563] outline-none font-bold cursor-pointer"
                    >
                      <option value="all">ALL PRIORITIES</option>
                      <option value="HIGH">🚨 HIGH ONLY</option>
                      <option value="MEDIUM">🟡 MEDIUM ONLY</option>
                      <option value="LOW">🟢 LOW ONLY</option>
                    </select>
                  </div>

                  {/* Filter Type */}
                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
                    <span className="text-[10px] text-[#9CA3AF] font-bold">TYPE:</span>
                    <select 
                      value={calendarFilterType} 
                      onChange={e => setCalendarFilterType(e.target.value)}
                      className="bg-transparent border-none text-[10px] text-[#4B5563] outline-none font-bold cursor-pointer"
                    >
                      <option value="all">ALL TYPES</option>
                      <option value="BOSS_TASK">🚨 BOSS REQUEST</option>
                      <option value="CLIENT_WORK">💼 CLIENT WORK</option>
                      <option value="GRAPHIC">🎨 GRAPHIC DESIGN</option>
                      <option value="MOTION">🎬 MOTION DESIGN</option>
                      <option value="SOCIAL">📱 SOCIAL MEDIA</option>
                    </select>
                  </div>

                  {/* Filter Status */}
                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
                    <span className="text-[10px] text-[#9CA3AF] font-bold">STATUS:</span>
                    <select 
                      value={calendarFilterStatus} 
                      onChange={e => setCalendarFilterStatus(e.target.value)}
                      className="bg-transparent border-none text-[10px] text-[#4B5563] outline-none font-bold cursor-pointer"
                    >
                      <option value="all">ALL STATUSES</option>
                      <option value="TODO">📝 TO-DO</option>
                      <option value="IN_PROGRESS">⚙️ IN PROGRESS</option>
                      <option value="COMPLETED">✅ COMPLETED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CALENDAR MONTHLY GRID */}
              <div className="bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex-1 flex flex-col min-h-[500px]">
                
                {/* Weekdays header */}
                <div className="grid grid-cols-7 gap-2 border-b border-[#F1F5F9] pb-3 shrink-0">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-2 flex-1 mt-3 min-h-0">
                  {calendarDays.map((cell, idx) => {
                    const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
                    
                    // Filter matching events for this cell
                    const cellEvents = calendarEvents.filter(event => {
                      if (event.date !== cell.dateStr) return false;
                      if (calendarFilterPriority !== "all" && event.priority !== calendarFilterPriority) return false;
                      if (calendarFilterType !== "all" && event.type !== calendarFilterType) return false;
                      if (calendarFilterStatus !== "all" && event.status !== calendarFilterStatus) return false;
                      return true;
                    });

                    return (
                      <div 
                        key={idx}
                        className={`min-h-[90px] border border-[#E2E8F0]/60 rounded-2xl p-2 flex flex-col justify-between transition-all duration-300 relative group/cell cursor-pointer hover:shadow-md hover:border-brand-red/20 ${
                          cell.isCurrentMonth ? "bg-white" : "bg-[#F8FAFC]/50 opacity-60"
                        } ${isToday ? "ring-2 ring-brand-red/30 border-brand-red/40" : ""}`}
                        onClick={() => {
                          setEditingCalendarEvent({
                            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
                            title: "",
                            clientName: "",
                            date: cell.dateStr,
                            time: "10:00",
                            status: "TODO",
                            priority: "MEDIUM",
                            type: "CLIENT_WORK",
                            description: ""
                          });
                        }}
                      >
                        {/* Day header */}
                        <div className="flex justify-between items-center shrink-0">
                          <span className={`text-xs font-bold font-mono ${
                            isToday ? "bg-brand-red text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md shadow-brand-red/20" : "text-[#1F2937]"
                          }`}>
                            {cell.day}
                          </span>
                          
                          {/* Quick add boss task indicator */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddQuickBossTask(cell.dateStr);
                            }}
                            className="opacity-0 group-hover/cell:opacity-100 p-1 rounded-lg bg-red-50 text-brand-red hover:bg-brand-red hover:text-white transition-all"
                            title="Quick Add Boss Request"
                          >
                            <AlertCircle size={10} />
                          </button>
                        </div>

                        {/* Events list */}
                        <div className="flex-1 mt-2 space-y-1 overflow-y-auto max-h-[75px] scrollbar-thin select-none">
                          {cellEvents.slice(0, 3).map((event) => {
                            const isBoss = event.type === "BOSS_TASK";
                            return (
                              <div
                                key={event.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingCalendarEvent({ ...event });
                                }}
                                className={`px-2 py-1 rounded-lg text-[9px] font-black truncate border transition-all ${
                                  isBoss 
                                    ? "bg-red-50 text-[#C5221F] border-red-200 hover:border-red-400 animate-pulse" 
                                    : event.status === "COMPLETED"
                                      ? "bg-emerald-50 text-[#137333] border-emerald-100 line-through opacity-70"
                                      : event.priority === "HIGH"
                                        ? "bg-amber-50 text-amber-800 border-amber-200"
                                        : "bg-blue-50 text-blue-800 border-blue-200"
                                }`}
                              >
                                {isBoss && "🚨 "}{event.title}
                              </div>
                            );
                          })}
                          {cellEvents.length > 3 && (
                            <div className="text-[8px] font-black text-[#9CA3AF] text-center uppercase tracking-wider font-mono">
                              +{cellEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: HOME LAYOUT & FEATURE SECTIONS CONFIG */}
          {activeTab === "content" && (
            <div className="flex flex-col gap-6 flex-1 min-h-0 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Homepage Feature Sections</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Enable/disable homepage feature sections and drag-sort their rendering order dynamically.</p>
                </div>
                <button 
                  onClick={handleSaveHomeConfig}
                  className="bg-brand-red hover:bg-blood-red text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(225,29,72,0.2)] flex items-center gap-2"
                >
                  <Save size={14} /> Save Layout Configuration
                </button>
              </div>

              {/* Layout Config Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
                
                {/* Left Side: Order & Status list */}
                <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] font-serif">Feature Display Priority Matrix</h4>
                      <p className="text-[9px] text-[#9CA3AF] font-bold tracking-wider font-mono mt-0.5">MANAGE VISIBILITY & RENDER SEQUENCING</p>
                    </div>
                    <span className="text-[9px] font-bold text-brand-red bg-brand-red/10 border border-brand-red/15 px-3 py-1 rounded-full font-mono uppercase">REALTIME</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 font-semibold text-xs text-[#4B5563]">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl animate-pulse" />
                      ))
                    ) : homeConfig.length === 0 ? (
                      <div className="py-12 text-center text-[#9CA3AF] font-mono">
                        NO DYNAMIC HOME SECTIONS DISCOVERED
                      </div>
                    ) : (
                      homeConfig.map((section, idx) => {
                        // Resolve user-friendly label
                        const labelMap: Record<string, string> = {
                          hero: "🚀 Hero Section / Intro Headline",
                          socialProof: "🤝 Trusted Logos / Collaborators Proof",
                          features: "⭐ Why Work With Me (Key Features)",
                          services: "🎨 Creative Expertise & Services Grid",
                          experience: "💼 Professional Career Experience Timeline",
                          process: "⚙️ Streamlined Creative Work Process",
                          testimonials: "💬 Client Testimonial Stories",
                          faqs: "🙋 Frequently Asked Questions & Answers",
                          cta: "📢 Dynamic Middle Call-To-Action Banner",
                          footer: "🏢 Footer Banner & Copyright Matrix"
                        };

                        return (
                          <div 
                            key={section.id}
                            className={`p-4 bg-white border rounded-2xl transition-all duration-300 flex items-center justify-between hover:shadow-md hover:border-brand-red/25 ${
                              section.enabled ? "border-[#E2E8F0] bg-white" : "border-[#E2E8F0]/60 bg-[#FAF9F6]/40 opacity-70"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {/* Order Badge */}
                              <div className="w-8 h-8 rounded-xl bg-surface-heavy border border-border flex items-center justify-center font-black text-xs font-mono text-[#111827]">
                                {idx + 1}
                              </div>
                              <div>
                                <span className="block text-sm font-bold text-[#111827]">{labelMap[section.id] || section.id}</span>
                                <span className="block text-[9px] text-[#9CA3AF] font-mono mt-0.5 font-bold uppercase tracking-wider">ID: {section.id}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                              {/* Sort Buttons */}
                              <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1 shadow-sm">
                                <button 
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveSection(section.id, "up")}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                                    idx === 0 ? "text-[#E2E8F0] cursor-not-allowed" : "text-[#4B5563] hover:bg-brand-red hover:text-white"
                                  }`}
                                  title="Move Section Up"
                                >
                                  ▲
                                </button>
                                <button 
                                  type="button"
                                  disabled={idx === homeConfig.length - 1}
                                  onClick={() => handleMoveSection(section.id, "down")}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                                    idx === homeConfig.length - 1 ? "text-[#E2E8F0] cursor-not-allowed" : "text-[#4B5563] hover:bg-brand-red hover:text-white"
                                  }`}
                                  title="Move Section Down"
                                >
                                  ▼
                                </button>
                              </div>

                              {/* Toggle visibility */}
                              <button 
                                type="button"
                                onClick={() => handleToggleSection(section.id)}
                                className={`px-4.5 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all border ${
                                  section.enabled 
                                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 font-extrabold" 
                                    : "bg-[#F1F5F9] border-transparent text-[#9CA3AF] hover:text-[#4B5563]"
                                }`}
                              >
                                {section.enabled ? "ACTIVE" : "DISABLED"}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Side: Informational Widget */}
                <div className="lg:col-span-4 space-y-6 shrink-0">
                  <div className="bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center">
                      <Type size={18} />
                    </div>
                    <h4 className="text-[#111827] text-sm font-bold font-serif">Dynamic Section Controller</h4>
                    <p className="text-[#6B7280] text-xs font-semibold leading-relaxed">
                      You can seamlessly adjust section loading displays. Turning off a section removes its visual weight instantly without breaking search crawler indexations.
                    </p>
                    <div className="border-t border-[#F1F5F9] pt-4 font-mono text-[9px] text-[#9CA3AF] space-y-1.5 uppercase font-bold tracking-widest">
                      <div className="flex justify-between"><span>TOTAL SECTIONS:</span> <span className="text-[#111827]">{homeConfig.length}</span></div>
                      <div className="flex justify-between"><span>VISIBLE STATES:</span> <span className="text-emerald-600">{homeConfig.filter(s => s.enabled).length}</span></div>
                      <div className="flex justify-between"><span>DISABLED STATES:</span> <span className="text-amber-600">{homeConfig.filter(s => !s.enabled).length}</span></div>
                    </div>
                  </div>
                </div>

                {/* Social Proof Configuration */}
                <div className="lg:col-span-12 mt-4 shrink-0">
                  <div className="bg-white border border-[#E2E8F0] rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="text-[#111827] text-sm font-bold font-serif">Social Proof / Trusted Logos</h4>
                        <p className="text-[#6B7280] text-xs font-semibold">Comma-separated list of brand names to show in the trusted banner.</p>
                      </div>
                      <button 
                        onClick={handleSaveSocialProof}
                        className="bg-brand-red text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(225,29,72,0.15)] flex items-center gap-2 hover:bg-blood-red"
                      >
                        <Save size={14} /> Save Logos
                      </button>
                    </div>
                    <input
                      type="text"
                      value={socialProof}
                      onChange={(e) => setSocialProof(e.target.value)}
                      placeholder="e.g. Vogue, Spotify, Nike, Netflix, Sony"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#111827] font-semibold text-sm focus:outline-none focus:border-brand-red focus:bg-white transition-all"
                    />
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 9: WORKSPACE USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="flex flex-col gap-6 flex-1 min-h-0 animate-fadeIn">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Workspace Users</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Monitor and manage all Gmail users registered on your custom workspace console.</p>
                </div>
                <button 
                  onClick={fetchData} 
                  className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blood-red transition-all text-xs shadow-[0_4px_12px_rgba(225,29,72,0.15)] cursor-pointer"
                >
                  <RefreshCw size={14} /> Refresh List
                </button>
              </div>

              {/* Data Table */}
              <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden flex flex-col min-h-0 relative shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse min-w-[700px] table-fixed">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[9px] tracking-[0.2em] font-bold text-[#9CA3AF] uppercase">
                        <th className="py-4 px-6 w-[220px]">User Name</th>
                        <th className="py-4 px-4 w-[280px]">Gmail Address</th>
                        <th className="py-4 px-4 w-[180px]">Password</th>
                        <th className="py-4 px-4 w-[120px] text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-xs text-[#4B5563] font-semibold">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                          <tr key={idx} className="animate-pulse">
                            <td className="py-4 px-6"><div className="h-4 bg-[#E2E8F0] rounded w-32" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-44" /></td>
                            <td className="py-4 px-4"><div className="h-4 bg-[#E2E8F0] rounded w-20" /></td>
                            <td className="py-4 px-4 text-right pr-8"><div className="h-8 bg-[#E2E8F0] rounded w-16 ml-auto" /></td>
                          </tr>
                        ))
                      ) : workspaceUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-16 text-center text-[#9CA3AF] font-medium font-mono">
                            NO WORKSPACE USERS FOUND
                          </td>
                        </tr>
                      ) : (
                        workspaceUsers.map(u => (
                          <tr key={u.email} className="hover:bg-[#F8FAFC] transition-colors group">
                            <td className="py-4 px-6 font-bold text-[#111827]">
                              {u.name}
                            </td>
                            <td className="py-4 px-4 font-mono text-[#6B7280]">
                              {u.email}
                            </td>
                            <td className="py-4 px-4 font-mono text-[#9CA3AF]">
                              {u.password}
                            </td>
                            <td className="py-4 px-4 text-right pr-8">
                              <button 
                                onClick={() => handleDeleteWorkspaceUser(u.email)}
                                className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-red-500 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-sm cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: CLIENT REVIEWS */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-6 flex-1 min-h-0 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-[#E2E8F0] pb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#111827] font-serif mb-2">Client Reviews</h2>
                  <p className="text-[#6B7280] text-xs font-semibold">Manage client testimonials and reviews. Share the link below with your clients.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + "/review");
                      addToast("Review link copied to clipboard!", "success");
                    }} 
                    className="bg-white border border-[#E2E8F0] text-[#111827] px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#F8FAFC] transition-all text-xs cursor-pointer"
                  >
                    <Copy size={14} /> Copy Review Link
                  </button>
                  <button 
                    onClick={fetchData} 
                    className="bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blood-red transition-all text-xs shadow-[0_4px_12px_rgba(225,29,72,0.15)] cursor-pointer"
                  >
                    <RefreshCw size={14} /> Refresh List
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden flex flex-col min-h-0 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[9px] tracking-[0.2em] font-bold text-[#9CA3AF] uppercase">
                        <th className="py-4 px-6 w-[200px]">Client</th>
                        <th className="py-4 px-4">Review</th>
                        <th className="py-4 px-4 w-[120px]">Rating</th>
                        <th className="py-4 px-4 w-[120px]">Status</th>
                        <th className="py-4 px-4 w-[150px] text-right pr-8">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-xs text-[#4B5563] font-semibold">
                      {reviewsData.map((review) => (
                        <tr key={review.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-[#111827]">{review.clientName}</p>
                            <p className="text-[#9CA3AF]">{review.role || "N/A"}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="truncate max-w-[300px]">{review.content}</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-1 text-yellow-500">
                              {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold ${review.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {review.isApproved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right pr-8 flex items-center justify-end gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch("/api/admin/reviews", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id: review.id, isApproved: !review.isApproved })
                                  });
                                  if (res.ok) {
                                    addToast("Review status updated", "success");
                                    fetchData();
                                  }
                                } catch (e) {
                                  addToast("Failed to update status", "error");
                                }
                              }}
                              className={`p-2.5 border rounded-xl transition-all shadow-sm cursor-pointer ${review.isApproved ? "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100" : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"}`}
                              title={review.isApproved ? "Revoke Approval" : "Approve Review"}
                            >
                              {review.isApproved ? <X size={12} /> : <CheckCircle size={12} />}
                            </button>
                            <button
                              onClick={async () => {
                                if(!confirm("Delete this review?")) return;
                                try {
                                  const res = await fetch(`/api/admin/reviews?id=${review.id}`, { method: "DELETE" });
                                  if (res.ok) {
                                    addToast("Review deleted", "success");
                                    fetchData();
                                  }
                                } catch (e) {
                                  addToast("Failed to delete", "error");
                                }
                              }}
                              className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-red-500 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-sm cursor-pointer"
                              title="Delete Review"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {reviewsData.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-16 text-center text-[#9CA3AF] font-medium font-mono">
                            NO REVIEWS FOUND
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


        </div>
      </main>

      {/* MODALS SEGMENT */}
      <AnimatePresence>
        
        {/* MODAL: CALENDAR EVENT FORM */}
        {editingCalendarEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-xl flex flex-col max-h-[90vh] shadow-2xl relative"
            >
              <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center shrink-0 bg-white rounded-t-3xl">
                <div>
                  <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2 font-serif">
                    <Calendar size={18} className="text-brand-red" />
                    {calendarEvents.some(e => e.id === editingCalendarEvent.id) ? "Modify Scheduled Event" : "Create Schedule Task"}
                  </h3>
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mt-1.5 font-bold">Creative Calendar Portal</p>
                </div>
                <button onClick={() => setEditingCalendarEvent(null)} className="p-2 text-[#9CA3AF] hover:text-[#111827] rounded-lg hover:bg-[#F3F4F6] transition-colors"><X size={16} /></button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-5 flex-1 text-xs font-semibold text-[#4B5563]">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Task Title *</label>
                  <input 
                    type="text" 
                    value={editingCalendarEvent.title} 
                    onChange={e => setEditingCalendarEvent({ ...editingCalendarEvent, title: e.target.value })} 
                    placeholder="e.g. Render final logo animation assets" 
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none" 
                  />
                </div>

                {/* Client & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Client Label</label>
                    <input 
                      type="text" 
                      value={editingCalendarEvent.clientName} 
                      onChange={e => setEditingCalendarEvent({ ...editingCalendarEvent, clientName: e.target.value })} 
                      placeholder="e.g. Lumina Co. or Boss" 
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Target Date *</label>
                    <input 
                      type="date" 
                      value={editingCalendarEvent.date} 
                      onChange={e => setEditingCalendarEvent({ ...editingCalendarEvent, date: e.target.value })} 
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none font-mono" 
                    />
                  </div>
                </div>

                {/* Time & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Time Schedule</label>
                    <input 
                      type="time" 
                      value={editingCalendarEvent.time || ""} 
                      onChange={e => setEditingCalendarEvent({ ...editingCalendarEvent, time: e.target.value })} 
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Priority Level</label>
                    <select 
                      value={editingCalendarEvent.priority} 
                      onChange={e => setEditingCalendarEvent({ ...editingCalendarEvent, priority: e.target.value as any })} 
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none font-bold"
                    >
                      <option value="LOW">🟢 LOW PRIORITY</option>
                      <option value="MEDIUM">🟡 MEDIUM PRIORITY</option>
                      <option value="HIGH">🚨 HIGH PRIORITY</option>
                    </select>
                  </div>
                </div>

                {/* Type & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Task Type</label>
                    <select 
                      value={editingCalendarEvent.type} 
                      onChange={e => setEditingCalendarEvent({ ...editingCalendarEvent, type: e.target.value as any })} 
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none font-bold"
                    >
                      <option value="CLIENT_WORK">💼 CLIENT WORK</option>
                      <option value="BOSS_TASK">🚨 BOSS URGENT REQUEST</option>
                      <option value="GRAPHIC">🎨 GRAPHIC DESIGN</option>
                      <option value="MOTION">🎬 MOTION DESIGN</option>
                      <option value="SOCIAL">📱 SOCIAL MEDIA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Status State</label>
                    <select 
                      value={editingCalendarEvent.status} 
                      onChange={e => setEditingCalendarEvent({ ...editingCalendarEvent, status: e.target.value as any })} 
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none font-bold"
                    >
                      <option value="TODO">📝 TO-DO / NOT STARTED</option>
                      <option value="IN_PROGRESS">⚙️ WORK IN PROGRESS</option>
                      <option value="COMPLETED">✅ COMPLETED</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Description / Task Details</label>
                  <textarea 
                    rows={3} 
                    value={editingCalendarEvent.description || ""} 
                    onChange={e => setEditingCalendarEvent({ ...editingCalendarEvent, description: e.target.value })} 
                    placeholder="Describe specific project brief, deadlines, feedback comments, etc."
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none resize-none" 
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#E2E8F0] flex justify-between items-center bg-white rounded-b-3xl shrink-0">
                <div>
                  {calendarEvents.some(e => e.id === editingCalendarEvent.id) && (
                    <button 
                      onClick={() => handleDeleteCalendarEvent(editingCalendarEvent.id)}
                      className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                    >
                      Delete Event
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditingCalendarEvent(null)} className="px-5 py-2.5 rounded-lg font-bold text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors">Cancel</button>
                  <button 
                    onClick={() => handleSaveCalendarEvent(editingCalendarEvent)} 
                    disabled={isSavingCalendarEvent}
                    className="bg-brand-red hover:bg-blood-red text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-[0_2px_10px_rgba(255,0,0,0.15)]"
                  >
                    {isSavingCalendarEvent ? "Saving..." : <><Save size={14} /> Save Event</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* MODAL 1: PROJECT FORM */}
        {editingProject && (() => {
          // Inner helper hook or states inside a dynamic sub-component context using immediate invocation
          const projectBlocks = Array.isArray(editingProject.blocks) ? editingProject.blocks : [];
          
          const handleAddTextBlock = () => {
            const newBlock = {
              id: Date.now().toString(),
              type: "text",
              content: "### Heading\nWrite your rich narrative case description here..."
            };
            setEditingProject({
              ...editingProject,
              blocks: [...projectBlocks, newBlock]
            });
          };

          const handleAddImageBlock = () => {
            const newBlock = {
              id: Date.now().toString(),
              type: "image",
              urls: ["/uploads/placeholder.jpg"],
              gridColumns: 1,
              marginZero: false
            };
            setEditingProject({
              ...editingProject,
              blocks: [...projectBlocks, newBlock]
            });
          };

          const handleAddVideoBlock = () => {
            const newBlock = {
              id: Date.now().toString(),
              type: "video",
              content: ""
            };
            setEditingProject({
              ...editingProject,
              blocks: [...projectBlocks, newBlock]
            });
          };

          const handleAddEmbedBlock = () => {
            const newBlock = {
              id: Date.now().toString(),
              type: "embed",
              content: ""
            };
            setEditingProject({
              ...editingProject,
              blocks: [...projectBlocks, newBlock]
            });
          };

          const handleRemoveBlock = (blockId: string) => {
            setEditingProject({
              ...editingProject,
              blocks: projectBlocks.filter((b: any) => b.id !== blockId)
            });
          };

          const handleMoveBlock = (index: number, direction: "up" | "down") => {
            const targetIndex = direction === "up" ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= projectBlocks.length) return;
            const updated = [...projectBlocks];
            const temp = updated[index];
            updated[index] = updated[targetIndex];
            updated[targetIndex] = temp;
            setEditingProject({
              ...editingProject,
              blocks: updated
            });
          };

          const handleUpdateBlockContent = (blockId: string, val: string) => {
            setEditingProject({
              ...editingProject,
              blocks: projectBlocks.map((b: any) => b.id === blockId ? { ...b, content: val } : b)
            });
          };

          const handleUpdateBlockImageGrid = (blockId: string, gridCols: number) => {
            setEditingProject({
              ...editingProject,
              blocks: projectBlocks.map((b: any) => b.id === blockId ? { ...b, gridColumns: gridCols } : b)
            });
          };

          const handleUpdateBlockMargin = (blockId: string, zeroMargin: boolean) => {
            setEditingProject({
              ...editingProject,
              blocks: projectBlocks.map((b: any) => b.id === blockId ? { ...b, marginZero: zeroMargin } : b)
            });
          };

          const handleAddImageToBlock = async (blockId: string, fileInputEvent: React.ChangeEvent<HTMLInputElement>) => {
            const file = fileInputEvent.target.files?.[0];
            if (!file) return;
            addToast(`Uploading block image...`, "info");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "image");
            try {
              const res = await fetch("/api/upload", { method: "POST", body: formData });
              const data = await res.json();
              if (res.ok && data.url) {
                addToast("Block image uploaded!", "success");
                setEditingProject({
                  ...editingProject,
                  blocks: projectBlocks.map((b: any) => {
                    if (b.id === blockId) {
                      const currentUrls = Array.isArray(b.urls) ? b.urls : [];
                      // If it's a placeholder, replace it. Otherwise append.
                      const nextUrls = currentUrls.filter((u: string) => !u.includes("placeholder.jpg"));
                      return { ...b, urls: [...nextUrls, data.url] };
                    }
                    return b;
                  })
                });
              } else {
                addToast("Image block upload failed.", "error");
              }
            } catch (err) {
              addToast("Upload error.", "error");
            }
          };

          const handleRemoveImageFromBlock = (blockId: string, imageUrl: string) => {
            setEditingProject({
              ...editingProject,
              blocks: projectBlocks.map((b: any) => {
                if (b.id === blockId) {
                  const currentUrls = Array.isArray(b.urls) ? b.urls : [];
                  const remaining = currentUrls.filter((u: string) => u !== imageUrl);
                  return { ...b, urls: remaining.length > 0 ? remaining : ["/uploads/placeholder.jpg"] };
                }
                return b;
              })
            });
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
              <motion.div 
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.97, opacity: 0 }}
                className="bg-white border border-[#E2E8F0] rounded-[2.5rem] w-full max-w-6xl flex flex-col h-[90vh] shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center shrink-0 bg-white">
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] flex items-center gap-2.5 font-serif">
                      <FolderKanban size={20} className="text-brand-red" />
                      Behance Creative Block Builder & Customizer
                    </h3>
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] mt-1.5 font-bold">Construct stunning seamless artwork case studies</p>
                  </div>
                  <button onClick={() => setEditingProject(null)} className="p-2 text-[#9CA3AF] hover:text-[#111827] rounded-xl hover:bg-[#F3F4F6] transition-colors"><X size={18} /></button>
                </div>

                {/* Workspace Split Body */}
                <div className="flex-1 flex min-h-0 text-xs font-semibold text-[#4B5563]">
                  
                  {/* Left Column: Metadata settings */}
                  <div className="w-1/3 border-r border-[#E2E8F0] p-6 overflow-y-auto space-y-5 bg-[#F8FAFC]/50 shrink-0">
                    <div>
                      <h4 className="text-xs uppercase tracking-[0.15em] text-[#9CA3AF] font-bold mb-4">Discoverability & Sidebar Settings</h4>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Project Title *</label>
                      <input 
                        type="text" 
                        value={editingProject.title} 
                        onChange={e => {
                          const newTitle = e.target.value;
                          const generatedSlug = newTitle.toLowerCase()
                            .trim()
                            .replace(/[^\w\s-]/g, '')
                            .replace(/\s+/g, '-');
                          setEditingProject({ 
                            ...editingProject, 
                            title: newTitle,
                            slug: !editingProject.slug || editingProject.slug === editingProject.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                              ? generatedSlug 
                              : editingProject.slug
                          });
                        }} 
                        placeholder="e.g. Behance Clone Series" 
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">ID Slug URL *</label>
                      <input 
                        type="text" 
                        value={editingProject.slug} 
                        onChange={e => setEditingProject({ ...editingProject, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} 
                        placeholder="e.g. behance-series" 
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none font-mono" 
                      />
                      {editingProject.slug && (
                        <div className="mt-2 flex items-center justify-between bg-brand-red/5 border border-brand-red/20 px-3.5 py-2 rounded-xl">
                          <span className="text-[9px] text-brand-red font-bold uppercase tracking-wider">Live Link chip</span>
                          <a 
                            href={`/portfolio/${editingProject.slug}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 text-[10px] text-brand-red hover:underline font-bold"
                          >
                            /portfolio/{editingProject.slug}
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Category *</label>
                        <select value={editingProject.catId} onChange={e => setEditingProject({ ...editingProject, catId: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none">
                          <option value="Branding">Branding</option>
                          <option value="Motion Design">Motion Design</option>
                          <option value="3D Animation">3D Animation</option>
                          <option value="Creative Direction">Creative Direction</option>
                          <option value="UI/UX">UI/UX</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Layout Size</label>
                        <select value={editingProject.size} onChange={e => setEditingProject({ ...editingProject, size: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none">
                          <option value="medium">Medium Card</option>
                          <option value="large">Large Card (Full Bleed)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Year *</label>
                        <input type="text" value={editingProject.year} onChange={e => setEditingProject({ ...editingProject, year: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none font-mono" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Client</label>
                        <input type="text" value={editingProject.client || ""} onChange={e => setEditingProject({ ...editingProject, client: e.target.value })} placeholder="e.g. Adobe" className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Primary Cover Thumbnail Image *</label>
                      <div className="flex gap-2">
                        <input type="text" value={editingProject.image} onChange={e => setEditingProject({ ...editingProject, image: e.target.value })} placeholder="/uploads/cover.jpg" className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none font-mono" />
                        <label className="bg-[#F1F5F9] hover:bg-brand-red hover:text-white px-3.5 py-2.5 rounded-xl border border-border cursor-pointer transition-all flex items-center justify-center shrink-0 text-xs">
                          Upload
                          <input type="file" accept="image/*" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("type", "image");
                            try {
                              const res = await fetch("/api/upload", { method: "POST", body: formData });
                              const data = await res.json();
                              if (res.ok && data.url) {
                                setEditingProject({ ...editingProject, image: data.url });
                                addToast("Cover thumbnail uploaded!", "success");
                              }
                            } catch (e) { addToast("Upload error", "error"); }
                          }} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Role</label>
                        <input type="text" value={editingProject.role || ""} onChange={e => setEditingProject({ ...editingProject, role: e.target.value })} placeholder="e.g. Lead designer" className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Theme Background</label>
                        <select value={editingProject.themeBackground || "black"} onChange={e => setEditingProject({ ...editingProject, themeBackground: e.target.value })} className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none">
                          <option value="black">Deep Dark (Black)</option>
                          <option value="gray">Sleek Metal (Gray)</option>
                          <option value="white">Minimalist (White)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Live Production Web URL</label>
                      <input type="text" value={editingProject.liveLink || ""} onChange={e => setEditingProject({ ...editingProject, liveLink: e.target.value })} placeholder="https://behance.net/..." className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none font-mono" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Brief Case Overview Description *</label>
                      <textarea rows={3} value={editingProject.overview || ""} onChange={e => setEditingProject({ ...editingProject, overview: e.target.value })} placeholder="Describe the core case study and aesthetic direction in a few sentences..." className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none resize-none" />
                    </div>
                  </div>

                  {/* Right Column: Interactive Block canvas */}
                  <div className="flex-1 flex flex-col min-h-0 bg-[#F1F5F9]/30">
                    
                    {/* Add block elements menu toolbar */}
                    <div className="p-4 bg-white border-b border-[#E2E8F0] shrink-0 flex items-center justify-between">
                      <div className="text-[10px] font-bold tracking-widest text-[#9CA3AF] uppercase">Build Modules</div>
                      <div className="flex gap-2">
                        <button type="button" onClick={handleAddTextBlock} className="px-3 py-2 bg-[#F1F5F9] hover:bg-brand-red hover:text-white rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#E2E8F0]">
                          <Type size={12} /> Text Description
                        </button>
                        <button type="button" onClick={handleAddImageBlock} className="px-3 py-2 bg-[#F1F5F9] hover:bg-brand-red hover:text-white rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#E2E8F0]">
                          <ImageIcon size={12} /> Images / Grid
                        </button>
                        <button type="button" onClick={handleAddVideoBlock} className="px-3 py-2 bg-[#F1F5F9] hover:bg-brand-red hover:text-white rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#E2E8F0]">
                          <Video size={12} /> Video Mp4
                        </button>
                        <button type="button" onClick={handleAddEmbedBlock} className="px-3 py-2 bg-[#F1F5F9] hover:bg-brand-red hover:text-white rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#E2E8F0]">
                          <Code size={12} /> Figma Embed
                        </button>
                      </div>
                    </div>

                    {/* Infinite Canvas Blocks list */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 min-h-0">
                      {projectBlocks.length === 0 ? (
                        <div className="py-24 text-center border-2 border-dashed border-[#E2E8F0] rounded-[2.5rem] bg-white p-12 max-w-lg mx-auto flex flex-col items-center justify-center space-y-4 shadow-sm mt-8">
                          <FolderKanban size={40} className="text-brand-red/35 animate-bounce" />
                          <h5 className="text-sm font-bold text-[#111827]">Canvas Block Space is Empty</h5>
                          <p className="text-[11px] text-[#6B7280] leading-relaxed">
                            Click any of the layout module modules in the toolbar above to stack rich text blocks, nested grid images, Vimeo/MP4 players, or interactive frame embeds.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6 max-w-3xl mx-auto">
                          {projectBlocks.map((block: any, idx: number) => (
                            <div key={block.id} className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all relative group flex flex-col gap-4">
                              
                              {/* Reorder and management toolbar */}
                              <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-3 shrink-0">
                                <div className="flex items-center gap-2">
                                  <GripVertical size={13} className="text-[#9CA3AF]" />
                                  <span className="text-[10px] font-black uppercase tracking-wider font-mono bg-brand-red/10 text-brand-red px-2 py-0.5 rounded">
                                    Module {idx + 1}: {block.type}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button type="button" disabled={idx === 0} onClick={() => handleMoveBlock(idx, "up")} className="p-1.5 hover:bg-[#F3F4F6] rounded text-[#4B5563] disabled:opacity-30"><ArrowUp size={12} /></button>
                                  <button type="button" disabled={idx === projectBlocks.length - 1} onClick={() => handleMoveBlock(idx, "down")} className="p-1.5 hover:bg-[#F3F4F6] rounded text-[#4B5563] disabled:opacity-30"><ArrowDown size={12} /></button>
                                  <button type="button" onClick={() => handleRemoveBlock(block.id)} className="p-1.5 hover:bg-red-500/10 rounded text-red-500 ml-1.5"><Trash2 size={12} /></button>
                                </div>
                              </div>

                              {/* BLOCK TYPE RENDERS */}

                              {/* 1. TEXT TYPE BLOCK */}
                              {block.type === "text" && (
                                <div className="space-y-2.5">
                                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">Markdown / Heading Rich Text Content</label>
                                  <textarea 
                                    rows={4} 
                                    value={block.content || ""} 
                                    onChange={e => handleUpdateBlockContent(block.id, e.target.value)} 
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none font-mono leading-relaxed" 
                                    placeholder="### Concept Description..."
                                  />
                                </div>
                              )}

                              {/* 2. IMAGE TYPE BLOCK */}
                              {block.type === "image" && (
                                <div className="space-y-4">
                                  <div className="flex flex-wrap gap-4 items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <label className="text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">Grid Columns Layout:</label>
                                      <select value={block.gridColumns || 1} onChange={e => handleUpdateBlockImageGrid(block.id, parseInt(e.target.value))} className="bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 rounded-xl text-xs font-bold outline-none cursor-pointer">
                                        <option value={1}>1 Column (Full Width)</option>
                                        <option value={2}>2 Columns Grid</option>
                                        <option value={3}>3 Columns Grid</option>
                                      </select>
                                    </div>
                                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#6B7280]">
                                      <input type="checkbox" checked={!!block.marginZero} onChange={e => handleUpdateBlockMargin(block.id, e.target.checked)} className="accent-brand-red w-3.5 h-3.5 rounded cursor-pointer" />
                                      Full Bleed / Zero Margin
                                    </label>
                                  </div>

                                  {/* Grid Images Gallery list */}
                                  <div className="grid grid-cols-3 gap-3 bg-[#F8FAFC] p-4 border border-[#E2E8F0] rounded-2xl">
                                    {(Array.isArray(block.urls) ? block.urls : ["/uploads/placeholder.jpg"]).map((imgUrl: string, imgIdx: number) => (
                                      <div key={imgIdx} className="relative aspect-video rounded-xl overflow-hidden border border-border group/img bg-surface">
                                        <img src={imgUrl} className="w-full h-full object-cover" alt="Block image preview" />
                                        <button type="button" onClick={() => handleRemoveImageFromBlock(block.id, imgUrl)} className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover/img:opacity-100"><X size={10} /></button>
                                      </div>
                                    ))}

                                    {/* Upload trigger slot */}
                                    <label className="border-2 border-dashed border-[#E2E8F0] bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-red transition-all p-3 hover:bg-brand-red/5 aspect-video shrink-0">
                                      <Plus size={14} className="text-brand-red" />
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF] mt-1">Add Image</span>
                                      <input type="file" accept="image/*" onChange={e => handleAddImageToBlock(block.id, e)} className="hidden" />
                                    </label>
                                  </div>
                                </div>
                              )}

                              {/* 3. VIDEO TYPE BLOCK */}
                              {block.type === "video" && (
                                <div className="space-y-3">
                                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">Direct MP4 Video Path / Vimeo Link / YouTube Embed</label>
                                  <div className="flex gap-2">
                                    <input 
                                      type="text" 
                                      value={block.content || ""} 
                                      onChange={e => handleUpdateBlockContent(block.id, e.target.value)} 
                                      placeholder="https://player.vimeo.com/video/123456789 or /uploads/cine.mp4" 
                                      className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:border-brand-red outline-none font-mono" 
                                    />
                                    
                                    <label className="bg-[#F1F5F9] hover:bg-brand-red hover:text-white px-3 py-2 rounded-xl border border-border cursor-pointer transition-all flex items-center justify-center shrink-0 text-xs">
                                      Upload MP4
                                      <input type="file" accept="video/mp4" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        addToast(`Uploading MP4 movie...`, "info");
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        formData.append("type", "pdf"); // Handled as bypass pdf document route or general uploads
                                        try {
                                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                                          const data = await res.json();
                                          if (res.ok && data.url) {
                                            handleUpdateBlockContent(block.id, data.url);
                                            addToast("Cinematic MP4 block uploaded!", "success");
                                          }
                                        } catch (err) { addToast("Video upload failed.", "error"); }
                                      }} className="hidden" />
                                    </label>
                                  </div>
                                </div>
                              )}

                              {/* 4. EMBED FIGMA PROTOTYPE BLOCK */}
                              {block.type === "embed" && (
                                <div className="space-y-2.5">
                                  <label className="block text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">Raw Iframe / Figma Prototype / SoundCloud Embed HTML</label>
                                  <textarea 
                                    rows={3} 
                                    value={block.content || ""} 
                                    onChange={e => handleUpdateBlockContent(block.id, e.target.value)} 
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 text-xs text-[#111827] focus:border-brand-red outline-none font-mono leading-relaxed" 
                                    placeholder='<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=..." allowfullscreen></iframe>'
                                  />
                                </div>
                              )}

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-[#E2E8F0] flex justify-between items-center bg-white shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingProject.isActive} onChange={e => setEditingProject({ ...editingProject, isActive: e.target.checked })} className="accent-brand-red w-4 h-4 cursor-pointer" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">PUBLISH LIVE ON ARCHIVE</span>
                  </label>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingProject(null)} className="px-5 py-2.5 rounded-xl font-bold text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors cursor-pointer text-xs">Cancel</button>
                    <button onClick={handleSaveModal} disabled={isSaving} className="bg-brand-red hover:bg-blood-red text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_4px_12px_rgba(225,29,72,0.15)] cursor-pointer text-xs">
                      {isSaving ? "Saving Dynamic Blocks..." : <><Save size={14} /> Publish Showcase</>}
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}

        {/* MODAL 2: SHOP PRODUCT FORM */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl relative"
            >
              <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center shrink-0 bg-white rounded-t-3xl">
                <div>
                  <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2 font-serif">
                    <FileText size={18} className="text-brand-red" />
                    {productsData.find(p => p.id === editingProduct.id) ? "Modify PDF Product" : "Publish New PDF Product"}
                  </h3>
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mt-1.5 font-bold">Secure Storefront Portal</p>
                </div>
                <button onClick={() => setEditingProduct(null)} className="p-2 text-[#9CA3AF] hover:text-[#111827] rounded-lg hover:bg-[#F3F4F6] transition-colors"><X size={16} /></button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-xs font-semibold text-[#4B5563]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Book Title *</label>
                    <input type="text" value={editingProduct.title} onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })} placeholder="e.g. Storyboarding Survival Manual" className={`w-full bg-[#F8FAFC] border rounded-xl px-4 py-3 text-xs text-[#111827] focus:ring-1 outline-none transition-colors ${formErrors.title ? "border-red-500/50 focus:ring-red-500/10" : "border-[#E2E8F0] focus:border-brand-red/30"}`} />
                    {formErrors.title && <p className="text-red-500 mt-1 font-semibold">{formErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Retail Price (৳) *</label>
                    <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} placeholder="e.g. 350" className={`w-full bg-[#F8FAFC] border rounded-xl px-4 py-3 text-xs text-[#111827] focus:ring-1 outline-none font-mono ${formErrors.price ? "border-red-500/50 focus:ring-red-500/10" : "border-[#E2E8F0] focus:border-brand-red/30"}`} />
                    {formErrors.price && <p className="text-red-500 mt-1 font-semibold">{formErrors.price}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Cover Thumbnail Image</label>
                    <div className="flex gap-3 items-center">
                      <input type="text" value={editingProduct.image} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} placeholder="https://images.unsplash.com/..." className={`flex-1 bg-[#F8FAFC] border rounded-xl px-4 py-3 text-xs text-[#111827] focus:ring-1 outline-none font-mono ${formErrors.image ? "border-red-500/50 focus:ring-red-500/10" : "border-[#E2E8F0] focus:border-brand-red/30"}`} />
                      
                      <label className="bg-[#F1F5F9] hover:bg-brand-red hover:text-white text-[#4B5563] text-xs font-bold px-4 py-3 rounded-xl border border-border cursor-pointer transition-all shrink-0 shadow-sm flex items-center gap-1.5">
                        {isUploadingImage ? <RefreshCw size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                        Upload Image
                        <input type="file" accept="image/*" onChange={e => handleUploadFile(e, "image")} className="hidden" />
                      </label>
                    </div>
                    {formErrors.image && <p className="text-red-500 mt-1 font-semibold">{formErrors.image}</p>}
                    
                    {/* Live Preview of image thumbnail */}
                    {editingProduct.image && (
                      <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-border bg-background">
                        <img src={editingProduct.image} className="w-full h-full object-cover" alt="Cover Preview" />
                        <button type="button" onClick={() => setEditingProduct({ ...editingProduct, image: "" })} className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"><X size={10} /></button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Downloadable PDF File *</label>
                    <div className="flex gap-3 items-center">
                      <input type="text" value={editingProduct.pdfUrl} onChange={e => setEditingProduct({ ...editingProduct, pdfUrl: e.target.value })} placeholder="/uploads/storyboards.pdf" className={`flex-1 bg-[#F8FAFC] border rounded-xl px-4 py-3 text-xs text-[#111827] focus:ring-1 outline-none font-mono ${formErrors.pdfUrl ? "border-red-500/50 focus:ring-red-500/10" : "border-[#E2E8F0] focus:border-brand-red/30"}`} />
                      
                      <label className="bg-[#F1F5F9] hover:bg-brand-red hover:text-white text-[#4B5563] text-xs font-bold px-4 py-3 rounded-xl border border-border cursor-pointer transition-all shrink-0 shadow-sm flex items-center gap-1.5">
                        {isUploadingPdf ? <RefreshCw size={12} className="animate-spin" /> : <FileText size={12} />}
                        Upload PDF
                        <input type="file" accept="application/pdf" onChange={e => handleUploadFile(e, "pdf")} className="hidden" />
                      </label>
                    </div>
                    {formErrors.pdfUrl && <p className="text-red-500 mt-1 font-semibold">{formErrors.pdfUrl}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Description Narrative *</label>
                  <textarea rows={4} value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className={`w-full bg-[#F8FAFC] border rounded-xl px-4 py-3 text-xs text-[#111827] focus:ring-1 outline-none resize-none ${formErrors.description ? "border-red-500/50 focus:ring-red-500/10" : "border-[#E2E8F0] focus:border-brand-red/30"}`} />
                  {formErrors.description && <p className="text-red-500 mt-1 font-semibold">{formErrors.description}</p>}
                </div>
              </div>

              <div className="p-6 border-t border-[#E2E8F0] flex justify-between items-center bg-white rounded-b-3xl shrink-0">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingProduct.isActive} onChange={e => setEditingProduct({ ...editingProduct, isActive: e.target.checked })} className="accent-brand-red w-4 h-4 cursor-pointer" /><span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Active for sale</span></label>
                <div className="flex gap-3">
                  <button onClick={() => setEditingProduct(null)} className="px-5 py-2.5 rounded-lg font-bold text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors">Cancel</button>
                  <button onClick={handleSaveProductModal} disabled={isSaving} className="bg-brand-red hover:bg-blood-red text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-[0_2px_10px_rgba(255,0,0,0.15)]">{isSaving ? "Saving..." : <><Save size={14} /> Publish Book</>}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

      {/* 4. TOAST NOTIFICATION STACK */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div 
              key={toast.id}
              initial={{ transform: "translateY(50px)", opacity: 0 }}
              animate={{ transform: "translateY(0)", opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl flex items-start gap-3 pointer-events-auto shadow-[0_10px_40px_rgba(0,0,0,0.08)] border text-xs font-semibold ${
                toast.type === "success" 
                  ? "bg-[#E6F4EA] border-[#A3E635]/20 text-[#137333]" 
                  : toast.type === "error" 
                    ? "bg-[#FCE8E6] border-[#EF4444]/20 text-[#C5221F]" 
                    : "bg-[#E8F0FE] border-[#3B82F6]/20 text-[#1A73E8]"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === "success" ? <CheckCircle size={14} /> : 
                 toast.type === "error" ? <AlertCircle size={14} /> : 
                 <RefreshCw size={14} className="animate-spin" />}
              </div>
              <div className="flex-1 pr-6">{toast.message}</div>
              <button onClick={() => removeToast(toast.id)} className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors shrink-0"><X size={12} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
