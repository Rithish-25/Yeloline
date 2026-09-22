import React from 'react';
import { Clock } from 'lucide-react';

export default function UserMasterModule() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 'calc(100vh - 120px)' }}>
      <div className="leads-header-row">
        <div>
          <h1 className="dashboard-title">User Master</h1>
          <p className="dashboard-subtitle">System users and access management module</p>
        </div>
      </div>
      <div style={{
        flex: 1,
        background: 'var(--light-card)',
        border: '1px solid var(--light-border)',
        borderRadius: 'var(--radius-md)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(250, 204, 21, 0.15)',
          color: 'var(--accent-yellow-dark)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Clock size={28} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>Coming Soon</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: '1.5' }}>
          The User Master module is currently under development and will be available soon.
        </p>
      </div>
    </div>
  );
}
