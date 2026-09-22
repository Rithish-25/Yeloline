import React from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { useApp } from '../../../context/AppContext';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  const { isSidebarCollapsed, toggleSidebar } = useApp();

  return (
    <div className="admin-app-shell">
      <Header />
      <div className="admin-body-grid">
        {!isSidebarCollapsed && (
          <div className="mobile-sidebar-backdrop" onClick={toggleSidebar} />
        )}
        <Sidebar />
        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
