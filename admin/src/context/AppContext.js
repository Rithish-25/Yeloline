import React, { createContext, useContext, useState, useEffect } from 'react';
import { exportToXLS, exportToPDF } from '../utils/exportUtils';
import {
  initialEnquiries,
  initialProjects,
  initialExpenses,
  initialPurchases,
  initialPayments,
  initialAppointments,
  initialMasterHighlights,
  monthlyFinancialOverview,
  initialUsers,
  initialDropdownMasters,
  masterCategoriesMeta,
  initialContactEnquiries,
  initialSites,
  SITE_COLUMNS_SPEC,
  initialCompanySettings
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
  const [sites, setSites] = useState(initialSites);

  // Settings State & Handlers
  const [companySettings, setCompanySettingsState] = useState(() => {
    const saved = localStorage.getItem('yeloline_company_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialCompanySettings;
      }
    }
    return initialCompanySettings;
  });

  const updateCompanySettings = (newSettings) => {
    setCompanySettingsState(newSettings);
    localStorage.setItem('yeloline_company_settings', JSON.stringify(newSettings));
    addNotification('Company contact numbers & WhatsApp settings updated successfully!');
  };

  // User Master States & Handlers
  const [users, setUsers] = useState(initialUsers);

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      user_id: `USR-${101 + users.length}`,
      joined_date: userData.joined_date || new Date().toISOString().split('T')[0],
      status: userData.status || 'Active',
      avatar_color: userData.avatar_color || '#3B82F6'
    };
    setUsers(prev => [newUser, ...prev]);
    addNotification(`Created new system user: ${newUser.full_name} (${newUser.role})`);
  };

  const updateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => u.user_id === updatedUser.user_id ? updatedUser : u));
    addNotification(`Updated system user profile: ${updatedUser.full_name}`);
  };

  const deleteUser = (user_id) => {
    const userToDelete = users.find(u => u.user_id === user_id);
    setUsers(prev => prev.filter(u => u.user_id !== user_id));
    if (userToDelete) {
      addNotification(`Deleted system user ${userToDelete.full_name}`);
    }
  };

  const toggleUserStatus = (user_id) => {
    setUsers(prev => prev.map(u => {
      if (u.user_id === user_id) {
        const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        addNotification(`Changed user status of ${u.full_name} to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  // Dropdown Master States & Handlers
  const [dropdownMasters, setDropdownMasters] = useState(initialDropdownMasters);
  const [adminMasterGroupFilter, setAdminMasterGroupFilter] = useState('All');

  const selectAdminMasterGroup = (groupKey) => {
    setAdminMasterGroupFilter(groupKey || 'All');
    setActiveTab('admin_master');
  };

  const addDropdownOption = (optionData) => {
    const newOption = {
      ...optionData,
      id: `DM-${1300 + dropdownMasters.length}`,
      status: optionData.status || 'Active',
      sort_order: Number(optionData.sort_order) || (dropdownMasters.length + 1)
    };
    setDropdownMasters(prev => [...prev, newOption]);
    addNotification(`Added new dropdown option "${newOption.label}" under category "${newOption.category}"`);
  };

  const updateDropdownOption = (updatedOption) => {
    setDropdownMasters(prev => prev.map(item => item.id === updatedOption.id ? updatedOption : item));
    addNotification(`Updated dropdown option: "${updatedOption.label}"`);
  };

  const deleteDropdownOption = (id) => {
    const target = dropdownMasters.find(item => item.id === id);
    setDropdownMasters(prev => prev.filter(item => item.id !== id));
    if (target) {
      addNotification(`Deleted dropdown option "${target.label}"`);
    }
  };

  const toggleDropdownOptionStatus = (id) => {
    setDropdownMasters(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
        addNotification(`Toggled status of option "${item.label}" to ${newStatus}`);
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const resetDropdownMastersToDefault = () => {
    setDropdownMasters(initialDropdownMasters);
    addNotification(`Reset all master dropdown options to system defaults`);
  };

  const getDropdownOptionsByCategory = (categoryKey) => {
    return dropdownMasters
      .filter(item => item.category === categoryKey && item.status === 'Active')
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(item => item.label);
  };

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

  // Sites Handlers
  const addSite = (siteData) => {
    const newSite = {
      ...siteData,
      site_id: `SITE-${101 + sites.length}`,
      progress_percentage: Number(siteData.progress_percentage) || 0,
      builtup_area_sqft: Number(siteData.builtup_area_sqft) || 0,
      estimated_budget: Number(siteData.estimated_budget) || 0,
      status: siteData.status || 'Planning'
    };
    setSites(prev => [newSite, ...prev]);
    addNotification(`Created new site record: ${newSite.site_name} (${newSite.site_id})`);
  };

  const updateSite = (updatedSite) => {
    setSites(prev => prev.map(s => s.site_id === updatedSite.site_id ? {
      ...updatedSite,
      progress_percentage: Number(updatedSite.progress_percentage) || 0,
      builtup_area_sqft: Number(updatedSite.builtup_area_sqft) || 0,
      estimated_budget: Number(updatedSite.estimated_budget) || 0
    } : s));
    addNotification(`Updated site details for ${updatedSite.site_name}`);
  };

  const deleteSite = (site_id) => {
    const siteToDelete = sites.find(s => s.site_id === site_id);
    setSites(prev => prev.filter(s => s.site_id !== site_id));
    if (siteToDelete) {
      addNotification(`Deleted site record ${siteToDelete.site_name}`);
    }
  };

  const importSites = (importedArray) => {
    const formatted = importedArray.map((r, idx) => ({
      ...r,
      site_id: r.site_id || `SITE-IMP${idx + 1}`,
      builtup_area_sqft: Number(r.builtup_area_sqft || 0),
      estimated_budget: Number(r.estimated_budget || 0),
      progress_percentage: Number(r.progress_percentage || 0),
      status: r.status || "Planning"
    }));
    setSites(prev => [...formatted, ...prev]);
    addNotification(`Successfully imported ${formatted.length} construction site records from CSV`);
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
    const total = Number(purchaseData.total_amount || 0);
    const paid = Number(purchaseData.amount_paid || 0);
    let payStatus = "Unpaid";
    if (paid >= total && total > 0) {
      payStatus = "Paid";
    } else if (paid > 0) {
      payStatus = "Partially Paid";
    }

    const newPO = {
      purchase_id: `PO-${301 + purchases.length}`,
      site_name: purchaseData.site_name || "Skyline Residency",
      department: purchaseData.department || "Masonry",
      vendor_name: purchaseData.vendor_name || "Shree Ganesh Bricks",
      material_category: purchaseData.material_category || "Red Bricks",
      order_date: purchaseData.order_date || new Date().toISOString().split('T')[0],
      total_amount: total,
      amount_paid: paid,
      delivery_status: purchaseData.delivery_status || "Ordered",
      payment_status: payStatus,
      invoice_number: purchaseData.invoice_number || `INV-PO-${301 + purchases.length}`
    };
    setPurchases(prev => [newPO, ...prev]);
    addNotification(`Created material purchase order ${newPO.purchase_id} for ${newPO.site_name}`);
  };

  const deletePurchase = (purchase_id) => {
    setPurchases(prev => prev.filter(p => p.purchase_id !== purchase_id));
  };

  const updatePurchaseDeliveryStatus = (purchase_id, status) => {
    setPurchases(prev => prev.map(p => p.purchase_id === purchase_id ? { ...p, delivery_status: status } : p));
  };

  const updatePurchasePaymentStatus = (purchase_id, status) => {
    setPurchases(prev => prev.map(p => p.purchase_id === purchase_id ? { ...p, payment_status: status } : p));
  };

  const addPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      payment_id: `PAY-${701 + payments.length}`,
      payment_date: paymentData.payment_date || new Date().toISOString().split('T')[0]
    };
    setPayments(prev => [newPayment, ...prev]);
    addNotification(`Recorded client payment ₹${newPayment.amount_received} for ${newPayment.site_name || newPayment.client_name}`);
  };

  const deletePayment = (payment_id) => {
    setPayments(prev => prev.filter(p => p.payment_id !== payment_id));
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

  // Contact Enquiries State & Handlers
  const [contactEnquiries, setContactEnquiries] = useState(initialContactEnquiries);

  const addContactEnquiry = (enquiryData) => {
    const newEntry = {
      contact_id: `CNT-${new Date().getFullYear()}-${String(contactEnquiries.length + 1).padStart(3, '0')}`,
      submission_date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'New',
      ...enquiryData
    };
    setContactEnquiries(prev => [newEntry, ...prev]);
  };

  const updateContactEnquiryStatus = (contact_id, newStatus) => {
    setContactEnquiries(prev => prev.map(item => item.contact_id === contact_id ? { ...item, status: newStatus } : item));
  };

  const deleteContactEnquiry = (contact_id) => {
    setContactEnquiries(prev => prev.filter(item => item.contact_id !== contact_id));
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
        sites,
        addSite,
        updateSite,
        deleteSite,
        importSites,
        SITE_COLUMNS_SPEC,
        expenses,
        addExpense,
        deleteExpense,
        importExpenses,
        purchases,
        addPurchase,
        deletePurchase,
        updatePurchaseDeliveryStatus,
        updatePurchasePaymentStatus,
        importPurchases,
        payments,
        addPayment,
        deletePayment,
        importPayments,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        assignTechnician,
        importAppointments,
        monthlyFinancialOverview,
        exportToCSV,
        exportToXLS,
        exportToPDF,
        // Contact Enquiries
        contactEnquiries,
        addContactEnquiry,
        updateContactEnquiryStatus,
        deleteContactEnquiry,
        // User Master
        users,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        // Admin Dropdown Master
        dropdownMasters,
        masterCategoriesMeta,
        addDropdownOption,
        updateDropdownOption,
        deleteDropdownOption,
        toggleDropdownOptionStatus,
        resetDropdownMastersToDefault,
        getDropdownOptionsByCategory,
        adminMasterGroupFilter,
        setAdminMasterGroupFilter,
        selectAdminMasterGroup,
        // Company Settings
        companySettings,
        updateCompanySettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
