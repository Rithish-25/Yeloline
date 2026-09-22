import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialEnquiries,
  initialProjects,
  initialExpenses,
  initialPurchases,
  initialPayments,
  initialAppointments,
  initialMasterHighlights,
  monthlyFinancialOverview
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('yeloline_admin_auth') === 'true';
  });
  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem('yeloline_admin_tab') || 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [theme] = useState('light'); // Website default light theme
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  const triggerSplashLoader = () => {
    setIsSplashLoading(true);
  };

  const handleSplashComplete = () => {
    setIsSplashLoading(false);
  };

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem('yeloline_admin_tab', tab);
  };

  const login = (email, password) => {
    if (email === 'admin@yeloline.com' && password === 'admin@123') {
      localStorage.setItem('yeloline_admin_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('yeloline_admin_auth');
    localStorage.removeItem('yeloline_admin_tab');
    setIsAuthenticated(false);
  };
  const [notifications, setNotifications] = useState([]);

  // Synchronize authentication & active tab state across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'yeloline_admin_auth') {
        setIsAuthenticated(e.newValue === 'true');
      }
      if (e.key === 'yeloline_admin_tab' && e.newValue) {
        setActiveTabState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle responsive sidebar collapse on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Module Data States
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [projects, setProjects] = useState(initialProjects);
  const [masterHighlights, setMasterHighlights] = useState(initialMasterHighlights);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [payments, setPayments] = useState(initialPayments);
  const [appointments, setAppointments] = useState(initialAppointments);

  const addMasterHighlight = (newHighlight) => {
    if (!newHighlight || !newHighlight.trim()) return;
    const trimmed = newHighlight.trim();
    if (!masterHighlights.includes(trimmed)) {
      setMasterHighlights(prev => [...prev, trimmed]);
      addNotification(`Added new architectural highlight option: "${trimmed}"`);
    }
  };

  // Apply theme to document root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const addNotification = (text) => {
    const newNotif = {
      id: Date.now(),
      text,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Enquiries Handlers
  const addEnquiry = (enquiryData) => {
    const newEnquiry = {
      ...enquiryData,
      enquiry_id: `ENQ-2026-00${enquiries.length + 1}`,
      enquiry_date: new Date().toISOString().split('T')[0]
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
    addNotification(`Created new lead: ${newEnquiry.client_name}`);
  };

  const updateEnquiryStage = (enquiry_id, newStage) => {
    setEnquiries(prev => prev.map(e => e.enquiry_id === enquiry_id ? { ...e, lead_stage: newStage } : e));
    addNotification(`Updated lead stage for ${enquiry_id} to ${newStage}`);
  };

  const deleteEnquiry = (enquiry_id) => {
    setEnquiries(prev => prev.filter(e => e.enquiry_id !== enquiry_id));
    addNotification(`Deleted enquiry ${enquiry_id}`);
  };

  // Projects Handlers
  const addProject = (projectData) => {
    const newProject = {
      ...projectData,
      project_id: `PRJ-${101 + projects.length}`,
      gallery_images: projectData.gallery_images || []
    };
    setProjects(prev => [newProject, ...prev]);
    addNotification(`Added new portfolio project: ${newProject.title}`);
  };

  const editProject = (updatedProject) => {
    setProjects(prev => prev.map(p => p.project_id === updatedProject.project_id ? updatedProject : p));
    addNotification(`Updated project details for ${updatedProject.title}`);
  };

  const deleteProject = (project_id) => {
    setProjects(prev => prev.filter(p => p.project_id !== project_id));
    addNotification(`Deleted project ${project_id}`);
  };

  const toggleFeaturedProject = (project_id) => {
    setProjects(prev => prev.map(p => p.project_id === project_id ? { ...p, featured: !p.featured } : p));
  };

  // Expenses Handlers
  const addExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      expense_id: `EXP-${801 + expenses.length}`,
      date: expenseData.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExpense, ...prev]);
    addNotification(`Logged ₹${newExpense.amount} site expense for ${newExpense.site_name}`);
  };

  const deleteExpense = (expense_id) => {
    setExpenses(prev => prev.filter(e => e.expense_id !== expense_id));
  };

  // Purchases Handlers
  const addPurchase = (purchaseData) => {
    const newPO = {
      ...purchaseData,
      purchase_id: `PO-${301 + purchases.length}`,
      total_amount: Number(purchaseData.quantity || 0) * Number(purchaseData.unit_price || 0),
      order_date: new Date().toISOString().split('T')[0]
    };
    setPurchases(prev => [newPO, ...prev]);
    addNotification(`Created material purchase order ${newPO.purchase_id}`);
  };

  const updatePurchaseDeliveryStatus = (purchase_id, status) => {
    setPurchases(prev => prev.map(p => p.purchase_id === purchase_id ? { ...p, delivery_status: status } : p));
  };

  const updatePurchasePaymentStatus = (purchase_id, status) => {
    setPurchases(prev => prev.map(p => p.purchase_id === purchase_id ? { ...p, payment_status: status } : p));
  };

  // Payments Handlers
  const addPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      payment_id: `PAY-${701 + payments.length}`,
      payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0]
    };
    setPayments(prev => [newPayment, ...prev]);
    addNotification(`Recorded client payment ₹${newPayment.amount_received} from ${newPayment.client_name}`);
  };

  // Appointments Handlers
  const addAppointment = (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      appointment_id: `APT-${501 + appointments.length}`,
      status: "Scheduled",
      technician_name: "Unassigned"
    };
    setAppointments(prev => [newAppointment, ...prev]);
    addNotification(`Scheduled renovation appointment for ${newAppointment.customer_name}`);
  };

  const updateAppointmentStatus = (appointment_id, status) => {
    setAppointments(prev => prev.map(a => a.appointment_id === appointment_id ? { ...a, status } : a));
  };

  const assignTechnician = (appointment_id, techName) => {
    setAppointments(prev => prev.map(a => a.appointment_id === appointment_id ? { ...a, technician_name: techName, status: "Technician Assigned" } : a));
    addNotification(`Assigned technician ${techName} to appointment ${appointment_id}`);
  };

  // CSV Exporter Helper
  const exportToCSV = (dataArray, filename) => {
    if (!dataArray || !dataArray.length) return;
    const keys = Object.keys(dataArray[0]).filter(k => typeof dataArray[0][k] !== 'object');
    const csvRows = [];
    csvRows.push(keys.join(','));

    for (const row of dataArray) {
      const values = keys.map(k => {
        const escaped = ('' + (row[k] ?? '')).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    a.click();
  };

  // CSV Importer Helpers
  const importEnquiries = (importedArray) => {
    const formatted = importedArray.map((r, idx) => ({
      ...r,
      enquiry_id: r.enquiry_id || `ENQ-2026-IMP${idx + 1}`,
      enquiry_date: r.enquiry_date || new Date().toISOString().split('T')[0],
      lead_stage: r.lead_stage || "New Enquiry"
    }));
    setEnquiries(prev => [...formatted, ...prev]);
    addNotification(`Successfully imported ${formatted.length} lead enquiries from CSV`);
  };

  const importExpenses = (importedArray) => {
    const formatted = importedArray.map((r, idx) => ({
      ...r,
      expense_id: r.expense_id || `EXP-IMP${idx + 1}`,
      date: r.date || new Date().toISOString().split('T')[0],
      amount: Number(r.amount || 0)
    }));
    setExpenses(prev => [...formatted, ...prev]);
    addNotification(`Successfully imported ${formatted.length} site expense records from CSV`);
  };

  const importPurchases = (importedArray) => {
    const formatted = importedArray.map((r, idx) => ({
      ...r,
      purchase_id: r.purchase_id || `PO-IMP${idx + 1}`,
      order_date: r.order_date || new Date().toISOString().split('T')[0],
      quantity: Number(r.quantity || 1),
      unit_price: Number(r.unit_price || 0),
      total_amount: Number(r.total_amount || 0),
      delivery_status: r.delivery_status || "Ordered",
      payment_status: r.payment_status || "Unpaid"
    }));
    setPurchases(prev => [...formatted, ...prev]);
    addNotification(`Successfully imported ${formatted.length} material purchase orders from CSV`);
  };

  const importPayments = (importedArray) => {
    const formatted = importedArray.map((r, idx) => ({
      ...r,
      payment_id: r.payment_id || `PAY-IMP${idx + 1}`,
      payment_date: r.payment_date || new Date().toISOString().split('T')[0],
      amount_received: Number(r.amount_received || 0)
    }));
    setPayments(prev => [...formatted, ...prev]);
    addNotification(`Successfully imported ${formatted.length} client milestone payments from CSV`);
  };

  const importAppointments = (importedArray) => {
    const formatted = importedArray.map((r, idx) => ({
      ...r,
      appointment_id: r.appointment_id || `APT-IMP${idx + 1}`,
      appointment_date: r.appointment_date || new Date().toISOString().split('T')[0],
      status: r.status || "Scheduled",
      technician_name: r.technician_name || "Unassigned"
    }));
    setAppointments(prev => [...formatted, ...prev]);
    addNotification(`Successfully imported ${formatted.length} renovation appointments from CSV`);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        isSplashLoading,
        triggerSplashLoader,
        handleSplashComplete,
        searchQuery,
        setSearchQuery,
        theme,
        isSidebarCollapsed,
        toggleSidebar,
        notifications,
        markAllNotificationsRead,
        // Data & Handlers
        enquiries,
        addEnquiry,
        updateEnquiryStage,
        deleteEnquiry,
        importEnquiries,
        projects,
        addProject,
        editProject,
        deleteProject,
        toggleFeaturedProject,
        masterHighlights,
        addMasterHighlight,
        expenses,
        addExpense,
        deleteExpense,
        importExpenses,
        purchases,
        addPurchase,
        updatePurchaseDeliveryStatus,
        updatePurchasePaymentStatus,
        importPurchases,
        payments,
        addPayment,
        importPayments,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        assignTechnician,
        importAppointments,
        monthlyFinancialOverview,
        exportToCSV
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
