import React, { useState } from 'react';
import { Bell, LogOut, CheckCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import './Header.css';

export default function Header() {
  const {
    notifications,
    markAllNotificationsRead,
    logout
  } = useApp();

  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="brand-title-area">
          <span className="brand-badge">YELOLINE</span>
          <span className="brand-text">Admin Panel</span>
        </div>
      </div>

      <div className="header-right">
        <div style={{ position: 'relative' }}>
          <button 
            className="header-icon-btn" 
            onClick={() => setShowNotifPopover(prev => !prev)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-pill" />}
          </button>

          {showNotifPopover && (
            <div className="notification-popover">
              <div className="notification-header">
                <span>Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button 
                    style={{ background: 'none', border: 'none', color: 'var(--accent-yellow-dark)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={markAllNotificationsRead}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              {notifications.slice(0, 5).map(n => (
                <div key={n.id} className="notification-item">
                  <div>{n.text}</div>
                  <div className="notification-time">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="user-profile-menu">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin Executive</span>
            <span className="user-role">Yeloline HQ</span>
          </div>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--danger-red)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
