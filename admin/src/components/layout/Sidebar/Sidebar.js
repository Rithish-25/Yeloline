import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Receipt,
  ShoppingCart,
  CreditCard,
  Truck,
  Building,
  UserCheck,
  Sliders,
  ChevronDown,
  ChevronRight,
  Grid,
  TrendingUp,
  Box,
  DollarSign,
  Wrench,
  ShieldCheck,
  FileText,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import './Sidebar.css';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    adminMasterGroupFilter,
    selectAdminMasterGroup
  } = useApp();

  const [isAdminMasterExpanded, setIsAdminMasterExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showLabels = !isSidebarCollapsed || isMobile;

  // Construction Specs has been cut from Admin Master and pasted into Quotes List
  const adminMasterSubMenus = [
    { key: 'All', label: 'All Categories', icon: Grid },
    { key: 'Leads', label: 'Leads & Enquiries', icon: TrendingUp },
    { key: 'Finance', label: 'Finance & Purchases', icon: DollarSign },
    { key: 'Services', label: 'Services & Appointments', icon: Wrench },
    { key: 'Users', label: 'User Roles', icon: ShieldCheck }
  ];

  const mainManagementItems = [
    {
      id: 'dashboard',
      label: 'Dashboard & Analytics',
      icon: LayoutDashboard
    },
    {
      id: 'lead_management',
      label: 'Quote & Enquiry Leads',
      icon: Users
    },
    {
      id: 'project_showcase',
      label: 'Portfolio Projects',
      icon: Building2
    },
    {
      id: 'renovation_appointments',
      label: 'Renovation Van Bookings',
      icon: Truck
    },
    {
      id: 'contact_enquiry',
      label: 'Contact Enquiry',
      icon: MessageSquare
    },
    {
      id: 'user_master',
      label: 'Customers',
      icon: Users
    },
    {
      id: 'quotes_list',
      label: 'Materials Master',
      icon: FileText,
      isMasterGroup: 'Materials'
    }
  ];

  const adminCoreItems = [
    {
      id: 'create_site',
      label: 'Create Site',
      icon: Building2
    },
    {
      id: 'site_expenses',
      label: 'Site Expense Tracker',
      icon: Receipt
    },
    {
      id: 'material_purchase',
      label: 'Material Purchase Orders',
      icon: ShoppingCart
    },
    {
      id: 'client_payments',
      label: 'Client Milestone Payments',
      icon: CreditCard
    }
  ];

  const sidebarRef = React.useRef(null);

  React.useEffect(() => {
    const sidebarEl = sidebarRef.current;
    if (!sidebarEl) return;

    const handleWheel = (e) => {
      const navEl = sidebarEl.querySelector('.sidebar-nav-container');
      if (!navEl) {
        e.preventDefault();
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = navEl;
      const isScrollable = scrollHeight > clientHeight;

      if (!isScrollable) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      const isUp = delta < 0;
      const isDown = delta > 0;

      if ((isUp && scrollTop <= 0) || (isDown && scrollTop + clientHeight >= scrollHeight - 1)) {
        e.preventDefault();
      }
    };

    sidebarEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      sidebarEl.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleNavClick = (item) => {
    if (item.isMasterGroup) {
      selectAdminMasterGroup(item.isMasterGroup);
    } else {
      setActiveTab(item.id);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleSubMenuClick = (groupKey, e) => {
    e.stopPropagation();
    selectAdminMasterGroup(groupKey);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const renderNavItem = (item) => {
    const IconComponent = item.icon;
    const isActive = item.id === 'quotes_list'
      ? (activeTab === 'admin_master' && adminMasterGroupFilter === 'Materials')
      : activeTab === item.id;
    return (
      <button
        key={item.id}
        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
        onClick={() => handleNavClick(item)}
        title={item.label}
      >
        <div className="sidebar-nav-icon">
          <IconComponent size={20} />
        </div>
        {showLabels && (
          <span className="sidebar-nav-label">{item.label}</span>
        )}
      </button>
    );
  };

  const isAdminMasterActive = activeTab === 'admin_master' && adminMasterGroupFilter !== 'Materials';

  return (
    <aside ref={sidebarRef} className={`left-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-nav-container">
        {showLabels && <div className="sidebar-section-label">Management Core</div>}
        {mainManagementItems.map(renderNavItem)}

        <div className="sidebar-divider" />

        {showLabels && <div className="sidebar-section-label">ADMIN MASTER</div>}
        {adminCoreItems.map(renderNavItem)}

        {/* Admin Master with Sub-Menus */}
        <div className="admin-master-menu-wrapper">
          <button
            className={`sidebar-nav-item ${isAdminMasterActive ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('admin_master');
              setIsAdminMasterExpanded(prev => !prev);
            }}
            title="Admin Master"
          >
            <div className="sidebar-nav-icon">
              <Sliders size={20} />
            </div>
            {showLabels && (
              <>
                <span className="sidebar-nav-label">Admin Master</span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                  {isAdminMasterExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </>
            )}
          </button>

          {/* Collapsible Sub-menu List */}
          {showLabels && isAdminMasterExpanded && (
            <div className="sidebar-sub-menu-list">
              {adminMasterSubMenus.map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = isAdminMasterActive && (adminMasterGroupFilter === subItem.key || (subItem.key === 'All' && !adminMasterGroupFilter));
                return (
                  <button
                    key={subItem.key}
                    className={`sidebar-sub-menu-item ${isSubActive ? 'active' : ''}`}
                    onClick={(e) => handleSubMenuClick(subItem.key, e)}
                  >
                    <SubIcon size={14} />
                    <span>{subItem.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="sidebar-divider" />

        {renderNavItem({
          id: 'settings',
          label: 'Settings',
          icon: Settings
        })}
      </div>

      <div className="sidebar-footer">
        {showLabels ? (
          <div>Yeloline Construction v2.0</div>
        ) : (
          <Building size={16} />
        )}
      </div>
    </aside>
  );
}
