import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  HardHat,
  Search,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Grid,
  List,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/common/Modal/Modal';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import DataTable from '../../components/common/DataTable/DataTable';
import './UserMasterModule.css';

const DEFAULT_AVATAR_COLORS = [
  '#EAB308', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#6366F1', '#06B6D4'
];

export default function UserMasterModule() {
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, dropdownMasters } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'Site Engineer',
    department: 'Civil Construction',
    assigned_sites: '',
    status: 'Active',
    avatar_color: '#3B82F6'
  });

  // Extract roles from Dropdown Master if available or fallback
  const roleOptions = dropdownMasters
    ? dropdownMasters
        .filter(d => d.category === 'user_role' && d.status === 'Active')
        .map(d => d.label)
    : [
        'Super Admin',
        'Project Manager',
        'Site Engineer',
        'Accountant',
        'Architecture Designer',
        'Quality Inspector'
      ];

  const departmentOptions = [
    'Management',
    'Operations',
    'Civil Construction',
    'Finance & Billing',
    'Design & 3D Studio',
    'Quality Assurance',
    'Procurement'
  ];

  // Quick Stats
  const totalUsersCount = users ? users.length : 0;
  const activeUsersCount = users ? users.filter(u => u.status === 'Active').length : 0;
  const adminManagerCount = users ? users.filter(u => u.role.includes('Admin') || u.role.includes('Manager')).length : 0;
  const siteEngineersCount = users ? users.filter(u => u.role.includes('Engineer') || u.role.includes('Inspector')).length : 0;

  // Filtered Users
  const filteredUsers = (users || []).filter(u => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      (u.assigned_sites && u.assigned_sites.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role: roleOptions[0] || 'Site Engineer',
      department: 'Civil Construction',
      assigned_sites: '',
      status: 'Active',
      avatar_color: DEFAULT_AVATAR_COLORS[Math.floor(Math.random() * DEFAULT_AVATAR_COLORS.length)]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'Site Engineer',
      department: user.department || 'Civil Construction',
      assigned_sites: user.assigned_sites || '',
      status: user.status || 'Active',
      avatar_color: user.avatar_color || '#3B82F6'
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim()) {
      alert('Please fill in required name and email fields.');
      return;
    }

    if (editingUser) {
      updateUser({
        ...editingUser,
        ...formData
      });
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Table Columns Setup
  const tableColumns = [
    {
      key: 'user',
      label: 'User Name & Email',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className="user-avatar-badge"
            style={{ backgroundColor: row.avatar_color || '#3B82F6', width: '38px', height: '38px', fontSize: '0.85rem' }}
          >
            {getInitials(row.full_name)}
          </div>
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{row.full_name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{row.phone}</span>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: '700',
            background: 'var(--primary-yellow-light)',
            color: 'var(--dark-charcoal)',
            border: '1px solid var(--primary-yellow)'
          }}
        >
          {row.role}
        </span>
      )
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => row.department
    },
    {
      key: 'assigned_sites',
      label: 'Assigned Sites',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          {row.assigned_sites || 'Unassigned'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <button
          className={`status-toggle-btn ${row.status === 'Active' ? 'active' : 'inactive'}`}
          onClick={() => toggleUserStatus(row.user_id)}
          title="Click to toggle status"
        >
          {row.status === 'Active' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
          {row.status}
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="user-actions">
          <button
            className="action-btn-icon"
            onClick={() => handleOpenEditModal(row)}
            title="Edit User"
          >
            <Edit3 size={15} />
          </button>
          <button
            className="action-btn-icon delete"
            onClick={() => setDeleteConfirmUser(row)}
            title="Delete User"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="user-master-container">
      {/* Header Row */}
      <div className="user-master-header">
        <div>
          <h1 className="dashboard-title">User Master</h1>
          <p className="dashboard-subtitle">
            Manage system administrators, project managers, site engineers, and staff access roles
          </p>
        </div>
        <button className="btn-primary" onClick={handleOpenAddModal}>
          <UserPlus size={18} />
          <span>Add New System User</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="user-master-stats-grid">
        <div className="user-stat-card">
          <div className="user-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
            <Users size={24} />
          </div>
          <div className="user-stat-info">
            <h4>{totalUsersCount}</h4>
            <p>Total System Users</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
            <UserCheck size={24} />
          </div>
          <div className="user-stat-info">
            <h4>{activeUsersCount}</h4>
            <p>Active System Users</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#EAB308' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="user-stat-info">
            <h4>{adminManagerCount}</h4>
            <p>Admins & Managers</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6' }}>
            <HardHat size={24} />
          </div>
          <div className="user-stat-info">
            <h4>{siteEngineersCount}</h4>
            <p>Engineers & QA Staff</p>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="user-controls-card">
        <div className="user-search-filters">
          <div className="user-search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search user by name, email, phone or site..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-dropdown-group">
            <span className="filter-field-label">Role:</span>
            <CustomSelect
              options={['All Roles', ...roleOptions]}
              value={selectedRole === 'All' ? 'All Roles' : selectedRole}
              onChange={(val) => {
                if (val === 'All Roles' || val === 'All') {
                  setSelectedRole('All');
                } else {
                  setSelectedRole(val);
                }
              }}
              placeholder="Select Role"
            />
          </div>

          <div className="filter-dropdown-group">
            <span className="filter-field-label">Status:</span>
            <CustomSelect
              options={['All Statuses', 'Active Only', 'Inactive Only']}
              value={selectedStatus === 'All' ? 'All Statuses' : (selectedStatus === 'Active' ? 'Active Only' : 'Inactive Only')}
              onChange={(val) => {
                if (val === 'All Statuses' || val === 'All') {
                  setSelectedStatus('All');
                } else if (val === 'Active Only' || val === 'Active') {
                  setSelectedStatus('Active');
                } else {
                  setSelectedStatus('Inactive');
                }
              }}
              placeholder="Select Status"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--light-background)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}>
          <button
            className={`action-btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
            style={viewMode === 'grid' ? { background: 'var(--light-card)', borderColor: 'var(--primary-yellow)' } : {}}
          >
            <Grid size={16} />
          </button>
          <button
            className={`action-btn-icon ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
            style={viewMode === 'table' ? { background: 'var(--light-card)', borderColor: 'var(--primary-yellow)' } : {}}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredUsers.length === 0 ? (
        <div className="empty-state-card" style={{ padding: '3rem', textAlign: 'center', background: 'var(--light-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--light-border)' }}>
          <Users size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No System Users Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            No user matches your current search filters. Try clearing filters or add a new user.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="user-grid">
          {filteredUsers.map((user) => (
            <div key={user.user_id} className="user-card">
              <div className="user-card-header">
                <div
                  className="user-avatar-badge"
                  style={{ backgroundColor: user.avatar_color || '#3B82F6' }}
                >
                  {getInitials(user.full_name)}
                </div>
                <div className="user-card-meta">
                  <div className="user-card-name">{user.full_name}</div>
                  <div className="user-card-email">{user.email}</div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.73rem',
                        fontWeight: '700',
                        background: 'var(--primary-yellow-light)',
                        color: 'var(--dark-charcoal)',
                        border: '1px solid var(--primary-yellow)'
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="user-details-list">
                <div className="user-detail-row">
                  <span className="user-detail-label"><Phone size={13} /> Mobile</span>
                  <span className="user-detail-value">{user.phone}</span>
                </div>
                <div className="user-detail-row">
                  <span className="user-detail-label"><Building2 size={13} /> Department</span>
                  <span className="user-detail-value">{user.department}</span>
                </div>
                <div className="user-detail-row">
                  <span className="user-detail-label"><MapPin size={13} /> Coverage</span>
                  <span className="user-detail-value" style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.assigned_sites || 'All Sites'}
                  </span>
                </div>
                <div className="user-detail-row">
                  <span className="user-detail-label"><Calendar size={13} /> Joined</span>
                  <span className="user-detail-value">{user.joined_date}</span>
                </div>
              </div>

              <div className="user-card-footer">
                <button
                  className={`status-toggle-btn ${user.status === 'Active' ? 'active' : 'inactive'}`}
                  onClick={() => toggleUserStatus(user.user_id)}
                  title="Click to toggle user active status"
                >
                  {user.status === 'Active' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>{user.status}</span>
                </button>

                <div className="user-actions">
                  <button
                    className="action-btn-icon"
                    onClick={() => handleOpenEditModal(user)}
                    title="Edit User Profile"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="action-btn-icon delete"
                    onClick={() => setDeleteConfirmUser(user)}
                    title="Delete User"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={filteredUsers}
          keyField="user_id"
          showSearch={false}
        />
      )}

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingUser ? `Edit User: ${editingUser.full_name}` : 'Add New System User'}
        >
          <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="user-form-grid">
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Senthil Nathan"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. senthil@yeloline.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="user-form-grid">
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Mobile Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. +91 98421 11223"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>System Role</label>
                <select
                  className="form-control"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="user-form-grid">
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Department</label>
                <select
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Account Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Assigned Project Sites / Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Perundurai Villa, Grand Emerald Commercial"
                value={formData.assigned_sites}
                onChange={(e) => setFormData({ ...formData, assigned_sites: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Avatar Color Badge</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                {DEFAULT_AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: formData.avatar_color === color ? '3px solid var(--dark-charcoal)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setFormData({ ...formData, avatar_color: color })}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <Modal
          isOpen={!!deleteConfirmUser}
          onClose={() => setDeleteConfirmUser(null)}
          title="Confirm User Deletion"
        >
          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Are you sure you want to delete system user <strong>{deleteConfirmUser.full_name}</strong>?
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              This action cannot be undone. Their site access and permissions will be revoked immediately.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn-secondary" onClick={() => setDeleteConfirmUser(null)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              style={{ background: 'var(--danger-red)', borderColor: 'var(--danger-red)', color: '#FFF' }}
              onClick={() => {
                deleteUser(deleteConfirmUser.user_id);
                setDeleteConfirmUser(null);
              }}
            >
              Delete User
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
