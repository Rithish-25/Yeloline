import React from 'react';
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
  Sliders
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import './Sidebar.css';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar
  } = useApp();

  const managementItems = [
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
      id: 'user_master',
      label: 'User Master',
      icon: UserCheck
    }
  ];

  const adminCoreItems = [
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
    },
    {
      id: 'admin_master',
      label: 'Admin Master',
      icon: Sliders
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

      // If sidebar is not scrollable, prevent scrolling main page
      if (!isScrollable) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      const isUp = delta < 0;
      const isDown = delta > 0;

      // If scrolled to top or bottom edge of sidebar nav, prevent scroll chaining to main page
      if ((isUp && scrollTop <= 0) || (isDown && scrollTop + clientHeight >= scrollHeight - 1)) {
        e.preventDefault();
      }
    };

    sidebarEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      sidebarEl.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const renderNavItem = (item) => {
    const IconComponent = item.icon;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
        onClick={() => handleNavClick(item.id)}
        title={item.label}
      >
        <div className="sidebar-nav-icon">
          <IconComponent size={20} />
        </div>
        {!isSidebarCollapsed && (
          <span className="sidebar-nav-label">{item.label}</span>
        )}
      </button>
    );
  };

  return (
    <aside ref={sidebarRef} className={`left-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-nav-container">
        {!isSidebarCollapsed && <div className="sidebar-section-label">Management Core</div>}
        {managementItems.map(renderNavItem)}

        <div className="sidebar-divider" />

        {!isSidebarCollapsed && <div className="sidebar-section-label">ADMIN MASTER</div>}
        {adminCoreItems.map(renderNavItem)}
      </div>

      <div className="sidebar-footer">
        {!isSidebarCollapsed ? (
          <div>Yeloline Construction v2.0</div>
        ) : (
          <Building size={16} />
        )}
      </div>
    </aside>
  );
}
