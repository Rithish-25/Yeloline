import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Grid,
  List,
  UserPlus,
  Send,
  Upload,
  Download,
  Building,
  CheckCircle,
  Truck,
  MessageSquare,
  FileText,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/common/Modal/Modal';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import DataTable from '../../components/common/DataTable/DataTable';
import CSVImportModal from '../../components/common/CSVImportModal/CSVImportModal';
import CSVExportModal from '../../components/common/CSVExportModal/CSVExportModal';
import './UserMasterModule.css';

const CUSTOMER_COLUMNS_SPEC = [
  { key: "name", label: "Customer Full Name", type: "String", required: true, example: "Senthil Kumar" },
  { key: "phone", label: "Mobile Number", type: "String", required: true, example: "+91 98765 43210" },
  { key: "email", label: "Email Address", type: "String", required: false, example: "senthil.k@gmail.com" },
  { key: "location", label: "Location / Site Address", type: "String", required: false, example: "Perundurai Road, Erode" },
  { key: "source", label: "Source Channel", type: "String", required: false, example: "Quote & Enquiry Lead" }
];

export default function UserMasterModule() {
  const {
    enquiries = [],
    appointments = [],
    contactEnquiries = [],
    exportToCSV
  } = useApp();

  const [customCustomers, setCustomCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleOpenDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    source: 'Quote & Enquiry Lead'
  });

  // Consolidate customers from all 3 sources + custom customers
  const allCustomers = useMemo(() => {
    const map = new Map();

    // 1. From Quote & Enquiry Leads
    (enquiries || []).forEach(item => {
      const name = item.client_name || item.name;
      const phone = item.client_phone || item.phone || '';
      if (!name) return;

      const key = `${name.toLowerCase().trim()}_${phone.replace(/[^0-9]/g, '')}`;
      if (!map.has(key)) {
        map.set(key, {
          id: `CUST-Q-${map.size + 1}`,
          name: name,
          phone: phone || '+91 98421 88321',
          email: item.client_email || item.email || '',
          location: item.site_location || item.location || 'Erode, TN',
          source: 'Quote & Enquiry Lead',
          avatar_color: '#EAB308'
        });
      }
    });

    // 2. From Renovation Van Bookings
    (appointments || []).forEach(item => {
      const name = item.customer_name || item.name;
      const phone = item.customer_phone || item.phone || '';
      if (!name) return;

      const key = `${name.toLowerCase().trim()}_${phone.replace(/[^0-9]/g, '')}`;
      if (!map.has(key)) {
        map.set(key, {
          id: `CUST-R-${map.size + 1}`,
          name: name,
          phone: phone || '+91 97892 11045',
          email: item.customer_email || item.email || '',
          location: item.site_location || item.location || 'Erode, TN',
          source: 'Renovation Van Booking',
          avatar_color: '#3B82F6'
        });
      }
    });

    // 3. From Contact Enquiry
    (contactEnquiries || []).forEach(item => {
      const name = item.name;
      const phone = item.phone || '';
      if (!name) return;

      const key = `${name.toLowerCase().trim()}_${phone.replace(/[^0-9]/g, '')}`;
      if (!map.has(key)) {
        map.set(key, {
          id: `CUST-C-${map.size + 1}`,
          name: name,
          phone: phone || '+91 98765 43210',
          email: item.email || '',
          location: item.location || 'Erode, TN',
          source: 'Contact Enquiry',
          avatar_color: '#10B981'
        });
      }
    });

    // 4. From Custom Added Customers
    customCustomers.forEach(item => {
      const key = `${item.name.toLowerCase().trim()}_${item.phone.replace(/[^0-9]/g, '')}`;
      map.set(key, item);
    });

    return Array.from(map.values());
  }, [enquiries, appointments, contactEnquiries, customCustomers]);

  // Filter Customers
  const filteredCustomers = allCustomers.filter(cust => {
    const matchesSearch =
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone.includes(searchTerm) ||
      (cust.email && cust.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cust.location && cust.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSource =
      selectedSource === 'All' || cust.source === selectedSource;

    return matchesSearch && matchesSource;
  });

  // Stats
  const totalCount = allCustomers.length;
  const phoneCount = allCustomers.filter(c => c.phone).length;
  const emailCount = allCustomers.filter(c => c.email).length;

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill in Customer Name and Phone Number.');
      return;
    }

    if (editingCustomer) {
      setCustomCustomers(prev =>
        prev.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...formData } : c)
      );
    } else {
      const newCust = {
        id: `CUST-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location || 'Erode, TN',
        source: formData.source || 'Direct Contact',
        avatar_color: '#8B5CF6'
      };
      setCustomCustomers(prev => [newCust, ...prev]);
    }

    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '', location: '', source: 'Direct Contact' });
  };

  const handleCSVImport = (data) => {
    let imported = 0;
    const newItems = [];
    data.forEach(row => {
      if (row.name && row.phone) {
        newItems.push({
          id: `CUST-IMP-${Date.now()}-${imported}`,
          name: row.name,
          phone: row.phone,
          email: row.email || '',
          location: row.location || 'Erode, TN',
          source: row.source || 'CSV Import',
          avatar_color: '#EC4899'
        });
        imported++;
      }
    });
    setCustomCustomers(prev => [...newItems, ...prev]);
    alert(`Successfully imported ${imported} customer records.`);
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Table Columns Specification
  const tableColumns = [
    {
      key: 'name',
      label: 'NAME',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className="user-avatar-badge"
            style={{ backgroundColor: row.avatar_color || '#3B82F6', width: '38px', height: '38px', fontSize: '0.85rem' }}
          >
            {getInitials(row.name)}
          </div>
          <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{row.name}</div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'PHONE NO',
      render: (row) => (
        <div style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
          <Phone size={14} style={{ color: 'var(--accent-yellow-dark, #D97706)' }} />
          <span>{row.phone || '—'}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'EMAIL ID',
      render: (row) => (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Mail size={14} style={{ color: '#3B82F6' }} />
          <span>{row.email || '—'}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (row) => (
        <div className="user-actions">
          <button
            className="action-btn-icon"
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetails(row);
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="user-master-container">
      {/* Header Bar */}
      <div className="user-master-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={26} style={{ color: 'var(--primary-yellow)' }} />
            Customers Database
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Centralized customer registry storing Renovation Van clients, Contact Enquiry submissions, and Quote Lead customers
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setIsImportModalOpen(true)}>
            <Upload size={16} /> Import CSV
          </button>

          <button className="btn-secondary" onClick={() => setIsExportModalOpen(true)}>
            <Download size={16} /> Export CSV
          </button>

          <button className="btn-primary" onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', email: '', location: '', source: 'Quote & Enquiry Lead' });
            setIsModalOpen(true);
          }}>
            <UserPlus size={16} /> Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="user-master-stats-grid">
        <div className="user-stat-card">
          <div className="user-stat-icon" style={{ background: 'rgba(250, 204, 21, 0.15)', color: 'var(--primary-yellow)' }}>
            <Users size={24} />
          </div>
          <div className="user-stat-info">
            <h4>{totalCount}</h4>
            <p>Total Customers</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
            <Phone size={24} />
          </div>
          <div className="user-stat-info">
            <h4 style={{ color: '#3B82F6' }}>{phoneCount}</h4>
            <p>Mobile Phone Numbers</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            <Mail size={24} />
          </div>
          <div className="user-stat-info">
            <h4 style={{ color: '#10B981' }}>{emailCount}</h4>
            <p>Email Addresses</p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="user-controls-card">
        <div className="user-search-filters">
          <div className="user-search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search customer by name, email or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="view-toggle-group">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid Cards View"
          >
            <Grid size={18} />
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table Rows View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredCustomers.length === 0 ? (
        <div className="empty-state-card" style={{ padding: '3rem', textAlign: 'center', background: 'var(--light-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--light-border)' }}>
          <Users size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Customers Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            No customer matches your search query. Try clearing search or add a new customer entry.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="user-cards-grid">
          {filteredCustomers.map((cust) => (
            <div key={cust.id} className="user-card" onClick={() => handleOpenDetails(cust)} style={{ cursor: 'pointer' }}>
              <div className="user-card-header">
                <div className="user-avatar-badge" style={{ backgroundColor: cust.avatar_color || '#3B82F6' }}>
                  {getInitials(cust.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="user-card-title">{cust.name}</h3>
                </div>
              </div>

              <div className="user-card-body">
                <div className="user-info-row">
                  <Phone size={14} className="info-icon" />
                  <span>{cust.phone || '—'}</span>
                </div>
                {cust.email && (
                  <div className="user-info-row">
                    <Mail size={14} className="info-icon" />
                    <span style={{ wordBreak: 'break-all' }}>{cust.email}</span>
                  </div>
                )}
              </div>

              <div className="user-card-footer" style={{ justifyContent: 'flex-end' }}>
                <button
                  className="action-btn-icon"
                  title="View Details"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetails(cust);
                  }}
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={filteredCustomers}
          keyField="id"
          showSearch={false}
          onRowClick={(row) => handleOpenDetails(row)}
        />
      )}

      {/* Customer Full Details Modal */}
      {isDetailsModalOpen && selectedCustomer && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`Customer Details: ${selectedCustomer.name}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--light-background)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--light-border)' }}>
              <div className="user-avatar-badge" style={{ backgroundColor: selectedCustomer.avatar_color || '#3B82F6', width: '52px', height: '52px', fontSize: '1.2rem' }}>
                {getInitials(selectedCustomer.name)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{selectedCustomer.name}</h3>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    background: selectedCustomer.source === 'Quote & Enquiry Lead' ? 'rgba(234, 179, 8, 0.15)' : (selectedCustomer.source === 'Renovation Van Booking' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                    color: selectedCustomer.source === 'Quote & Enquiry Lead' ? '#D97706' : (selectedCustomer.source === 'Renovation Van Booking' ? '#2563EB' : '#059669')
                  }}
                >
                  {selectedCustomer.source}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'var(--light-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Mobile Phone</div>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px', fontSize: '0.95rem' }}>{selectedCustomer.phone}</div>
              </div>

              <div style={{ background: 'var(--light-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Email Address</div>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px', fontSize: '0.95rem', wordBreak: 'break-all' }}>{selectedCustomer.email || '—'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
              <a
                href={`tel:${selectedCustomer.phone}`}
                className="customer-call-btn"
                style={{ textDecoration: 'none' }}
              >
                <Phone size={15} /> Call Customer
              </a>
              <a
                href={`https://wa.me/${selectedCustomer.phone ? selectedCustomer.phone.replace(/[^0-9]/g, '') : ''}?text=Hello%20${encodeURIComponent(selectedCustomer.name)},%20greetings%20from%20Yeloline%20Construction.`}
                target="_blank"
                rel="noreferrer"
                className="customer-wa-btn"
                style={{ textDecoration: 'none' }}
              >
                <Send size={15} /> WhatsApp
              </a>
              <button className="btn-secondary" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCustomer ? `Edit Customer: ${editingCustomer.name}` : 'Add New Customer Entry'}
        >
          <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="user-form-grid">
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Customer Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Senthil Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Mobile Phone Number *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.85rem' }}>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. senthil.k@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Customer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <CSVImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          title="Import Customers from CSV"
          columnsSpec={CUSTOMER_COLUMNS_SPEC}
          onImport={handleCSVImport}
        />
      )}

      {/* CSV Export Modal */}
      {isExportModalOpen && (
        <CSVExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          title="Export Customers Database to CSV"
          data={filteredCustomers}
          columnsSpec={CUSTOMER_COLUMNS_SPEC}
          defaultFilename="yeloline_customers_database.csv"
          onExport={(dataToExport, filename) => exportToCSV(dataToExport, filename)}
        />
      )}
    </div>
  );
}
