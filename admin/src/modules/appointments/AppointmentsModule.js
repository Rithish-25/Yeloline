import React, { useState } from 'react';
import { Plus, Download, Upload, Truck, Phone, Calendar, UserCheck, CheckCircle2, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/common/DataTable/DataTable';
import Modal from '../../components/common/Modal/Modal';
import MetricCard from '../../components/common/MetricCard/MetricCard';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import CSVImportModal from '../../components/common/CSVImportModal/CSVImportModal';
import CSVExportModal from '../../components/common/CSVExportModal/CSVExportModal';
import './AppointmentsModule.css';

const SERVICES_LIST = [
  "Full Home Renovation",
  "Kitchen Remodeling",
  "Bathroom Upgrade",
  "Painting & Waterproofing",
  "Roofing & Structure"
];

const TECHNICIANS = [
  "Selvam (Senior Inspector)",
  "Murugan (Van Tech Lead)",
  "Kannan (Electrical Specialist)",
  "Senthil (Plumbing Expert)"
];

const STATUS_OPTIONS = ["Scheduled", "Technician Assigned", "Completed", "Cancelled"];

const APPOINTMENT_COLUMNS_SPEC = [
  { key: "appointment_id", label: "Appointment ID", type: "String", required: true, example: "APT-501" },
  { key: "customer_name", label: "Customer Full Name", type: "String", required: true, example: "Gokulakrishnan M." },
  { key: "customer_phone", label: "Customer Phone", type: "String", required: true, example: "+91 98427 12900" },
  { key: "site_location", label: "Site Location", type: "String", required: true, example: "Sampath Nagar, Erode" },
  { key: "appointment_date", label: "Visit Date", type: "Date", required: true, example: "2026-09-22" },
  { key: "status", label: "Booking Status", type: "String", required: true, example: "Technician Assigned" },
  { key: "technician_name", label: "Assigned Lead Tech", type: "String", required: true, example: "Selvam (Senior Inspector)" }
];

const SAMPLE_APPOINTMENT_ROW = {
  appointment_id: "APT-501",
  customer_name: "Gokulakrishnan M.",
  customer_phone: "+91 98427 12900",
  site_location: "Sampath Nagar, Erode",
  appointment_date: "2026-09-22",
  status: "Technician Assigned",
  technician_name: "Selvam (Senior Inspector)"
};

export default function AppointmentsModule() {
  const { appointments, addAppointment, updateAppointmentStatus, assignTechnician, importAppointments, exportToCSV } = useApp();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [assignModalAppointment, setAssignModalAppointment] = useState(null);
  const [selectedTech, setSelectedTech] = useState(TECHNICIANS[0]);

  const [formData, setFormData] = useState({
    customer_name: 'Ganesh Kumar',
    customer_phone: '+91 98422 10982',
    site_location: 'Perundurai, Erode',
    appointment_date: new Date().toISOString().split('T')[0],
    renovation_services: ["Kitchen Remodeling"]
  });

  const filteredAppointments = selectedStatusFilter === 'ALL'
    ? appointments
    : appointments.filter(a => a.status === selectedStatusFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    addAppointment(formData);
    setIsModalOpen(false);
  };

  const toggleServiceChoice = (srv) => {
    setFormData(prev => {
      const exists = prev.renovation_services.includes(srv);
      return {
        ...prev,
        renovation_services: exists
          ? prev.renovation_services.filter(s => s !== srv)
          : [...prev.renovation_services, srv]
      };
    });
  };

  const columns = [
    {
      header: "APT ID",
      key: "appointment_id",
      render: (r) => <span style={{ fontWeight: '700', color: 'var(--accent-yellow-dark)' }}>{r.appointment_id}</span>
    },
    { header: "Customer Name", key: "customer_name", render: (r) => <strong>{r.customer_name}</strong> },
    {
      header: "Phone",
      key: "customer_phone",
      render: (r) => (
        <a
          href={`tel:${r.customer_phone}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-yellow-dark)', fontWeight: '600', textDecoration: 'none' }}
        >
          <Phone size={13} /> {r.customer_phone}
        </a>
      )
    },
    { header: "Site Location", key: "site_location" },
    { header: "Date", key: "appointment_date" },
    {
      header: "Services Requested",
      key: "renovation_services",
      render: (r) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {(r.renovation_services || []).map((srv, idx) => (
            <span key={idx} className="service-tag">{srv}</span>
          ))}
        </div>
      )
    },
    {
      header: "Assigned Tech",
      key: "technician_name",
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{r.technician_name || 'Unassigned'}</span>
          <button
            style={{ background: 'var(--primary-yellow-light)', border: 'none', color: 'var(--accent-yellow-dark)', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: '700' }}
            onClick={() => setAssignModalAppointment(r)}
          >
            Assign
          </button>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      render: (r) => (
        <select
          className="filter-select"
          style={{ padding: '2px 6px', fontSize: '0.78rem' }}
          value={r.status}
          onChange={(e) => updateAppointmentStatus(r.appointment_id, e.target.value)}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )
    }
  ];

  return (
    <div className="appointments-container">
      <div className="leads-header-row">
        <div>
          <h1 className="dashboard-title">Renovation Van & Site Appointments</h1>
          <p className="dashboard-subtitle">Manage mobile Renovation Van technician site visits & customer bookings</p>
        </div>
        <div className="header-action-group">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Schedule Appointment
          </button>
          <div className="csv-action-group">
            <button
              className="btn-secondary"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload size={16} /> Import CSV
            </button>
            <button
              className="btn-secondary"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Van Feature Banner */}
      <div className="van-banner">
        <div>
          <div className="van-title"><Truck size={20} /> Mobile Renovation Van Fleet active in Erode Zone</div>
          <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Equipped with 3D laser scanners, tile samples, moisture meters & instant quote estimation kits.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ fontSize: '0.85rem' }}>Active Vans: <strong>4 Units</strong></div>
          <div style={{ fontSize: '0.85rem' }}>Visits Today: <strong>6 Completed</strong></div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <MetricCard
          title="Total Bookings"
          value={appointments.length}
          icon={Calendar}
          highlight
        />
        <MetricCard
          title="Technician Assigned"
          value={appointments.filter(a => a.technician_name && a.technician_name !== 'Unassigned').length}
          icon={UserCheck}
        />
        <MetricCard
          title="Completed Site Visits"
          value={appointments.filter(a => a.status === 'Completed').length}
          icon={CheckCircle2}
        />
      </div>

      {/* Filter Bar */}
      <div className="leads-filter-bar">
        <CustomSelect
          icon={Filter}
          label="Status:"
          value={selectedStatusFilter}
          onChange={(val) => setSelectedStatusFilter(val)}
          options={[
            { value: "ALL", label: `All Statuses (${appointments.length})`, badge: appointments.length },
            ...STATUS_OPTIONS.map(s => ({
              value: s,
              label: s,
              badge: appointments.filter(a => a.status === s).length
            }))
          ]}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredAppointments}
        searchPlaceholder="Search customer, location, tech..."
        pageSize={8}
      />

      {/* Create Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Renovation Van Site Appointment"
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Customer Phone *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Site Address / Location *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g., Perundurai Road, Erode"
              value={formData.site_location}
              onChange={(e) => setFormData({ ...formData, site_location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.appointment_date}
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Renovation Services Needed</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {SERVICES_LIST.map(srv => {
                const active = formData.renovation_services.includes(srv);
                return (
                  <button
                    key={srv}
                    type="button"
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--light-border)',
                      backgroundColor: active ? 'var(--primary-yellow)' : 'var(--light-background)',
                      color: active ? 'var(--dark-charcoal)' : 'var(--text-primary)',
                      fontWeight: active ? '800' : '600',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                    onClick={() => toggleServiceChoice(srv)}
                  >
                    {srv}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Book Appointment
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Technician Modal */}
      {assignModalAppointment && (
        <Modal
          isOpen={!!assignModalAppointment}
          onClose={() => setAssignModalAppointment(null)}
          title={`Assign Technician to ${assignModalAppointment.appointment_id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong>Customer:</strong> {assignModalAppointment.customer_name} ({assignModalAppointment.site_location})
            </div>
            <div className="form-group">
              <label className="form-label">Select Van Technician</label>
              <select
                className="form-input"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
              >
                {TECHNICIANS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  assignTechnician(assignModalAppointment.appointment_id, selectedTech);
                  setAssignModalAppointment(null);
                }}
              >
                Confirm Technician Assignment
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Renovation Appointments CSV"
        moduleName="Renovation Appointments"
        compulsoryColumns={APPOINTMENT_COLUMNS_SPEC}
        sampleRow={SAMPLE_APPOINTMENT_ROW}
        onImport={(data) => importAppointments(data)}
      />

      {/* CSV Export Modal */}
      <CSVExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Renovation Appointments CSV"
        moduleName="Renovation Appointments"
        columns={APPOINTMENT_COLUMNS_SPEC}
        data={appointments}
        onConfirmExport={() => exportToCSV(appointments, 'Yeloline_Renovation_Appointments')}
      />
    </div>
  );
}
