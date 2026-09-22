import React, { useState } from 'react';
import { Plus, Download, Upload, Edit3, Trash2, Phone, Mail, MapPin, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/common/DataTable/DataTable';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import Modal from '../../components/common/Modal/Modal';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import CSVImportModal from '../../components/common/CSVImportModal/CSVImportModal';
import CSVExportModal from '../../components/common/CSVExportModal/CSVExportModal';
import './LeadManagementModule.css';

const STAGE_OPTIONS = [
  "New Enquiry",
  "Contacted",
  "Site Visit Scheduled",
  "Estimate Shared",
  "Converted",
  "Closed"
];

const STRUCTURE_TYPES = [
  "Residential House",
  "Commercial Building",
  "Villa",
  "Renovation & Remodeling"
];

const ENQUIRY_COLUMNS_SPEC = [
  { key: "enquiry_id", label: "Enquiry ID", type: "String", required: true, example: "ENQ-2026-001" },
  { key: "client_name", label: "Client Full Name", type: "String", required: true, example: "Ramesh Sundaram" },
  { key: "client_phone", label: "Phone Number", type: "String", required: true, example: "+91 98421 88321" },
  { key: "client_email", label: "Email Address", type: "String", required: true, example: "ramesh.s@gmail.com" },
  { key: "site_location", label: "Site Address", type: "String", required: true, example: "Perundurai Road, Erode" },
  { key: "structure_type", label: "Structure Type", type: "String", required: true, example: "Villa" },
  { key: "builtup_area_sqft", label: "Builtup Area", type: "Number", required: true, example: "3200" },
  { key: "cement_brand", label: "Cement Brand", type: "String", required: true, example: "UltraTech Super Premium" },
  { key: "estimated_rate_per_sqft", label: "Est. Rate", type: "String", required: true, example: "₹2,250" },
  { key: "total_estimated_cost", label: "Total Cost (₹)", type: "Number", required: true, example: "7200000" },
  { key: "enquiry_date", label: "Enquiry Date", type: "Date", required: true, example: "2026-09-18" },
  { key: "lead_stage", label: "Lead Stage", type: "String", required: true, example: "Estimate Shared" }
];

const SAMPLE_ENQUIRY_ROW = {
  client_name: "Ramesh Sundaram",
  client_phone: "+91 98421 88321",
  client_email: "ramesh.s@gmail.com",
  site_location: "Perundurai Road, Erode",
  structure_type: "Villa",
  builtup_area_sqft: 3200,
  cement_brand: "UltraTech Super Premium",
  estimated_rate_per_sqft: "₹2,250",
  total_estimated_cost: 7200000,
  enquiry_date: "2026-09-18",
  lead_stage: "Estimate Shared"
};

export default function LeadManagementModule() {
  const { enquiries, addEnquiry, updateEnquiryStage, deleteEnquiry, importEnquiries, exportToCSV } = useApp();
  const [selectedStageFilter, setSelectedStageFilter] = useState('ALL');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedEnquiryForStage, setSelectedEnquiryForStage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    site_location: '',
    structure_type: 'Villa',
    builtup_area_sqft: 2500,
    cement_brand: 'UltraTech Cement',
    estimated_rate_per_sqft: '₹2,200',
    total_estimated_cost: 5500000,
    lead_stage: 'New Enquiry'
  });

  const filteredEnquiries = selectedStageFilter === 'ALL'
    ? enquiries
    : enquiries.filter(e => e.lead_stage === selectedStageFilter);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addEnquiry(formData);
    setIsAddModalOpen(false);
    setFormData({
      client_name: '',
      client_phone: '',
      client_email: '',
      site_location: '',
      structure_type: 'Villa',
      builtup_area_sqft: 2500,
      cement_brand: 'UltraTech Cement',
      estimated_rate_per_sqft: '₹2,200',
      total_estimated_cost: 5500000,
      lead_stage: 'New Enquiry'
    });
  };

  const columns = [
    {
      header: "Enquiry ID",
      key: "enquiry_id",
      render: (r) => <span style={{ fontWeight: '700', color: 'var(--accent-yellow-dark)', whiteSpace: 'nowrap' }}>{r.enquiry_id}</span>
    },
    {
      header: "Client Contact",
      key: "client_name",
      render: (r) => (
        <div>
          <div style={{ fontWeight: '700' }}>{r.client_name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <Phone size={12} /> {r.client_phone}
          </div>
          {r.client_email && (
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <Mail size={12} /> {r.client_email}
            </div>
          )}
        </div>
      )
    },
    {
      header: "Location & Area",
      key: "site_location",
      render: (r) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}><MapPin size={13} /> {r.site_location}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.builtup_area_sqft} sq. ft.</div>
        </div>
      )
    },
    { header: "Structure Type", key: "structure_type" },
    {
      header: "Est. Cost",
      key: "total_estimated_cost",
      render: (r) => <strong style={{ whiteSpace: 'nowrap' }}>₹{Number(r.total_estimated_cost).toLocaleString('en-IN')}</strong>
    },
    {
      header: "Date",
      key: "enquiry_date",
      render: (r) => <span style={{ whiteSpace: 'nowrap' }}>{r.enquiry_date}</span>
    },
    {
      header: "Stage",
      key: "lead_stage",
      render: (r) => <StatusBadge status={r.lead_stage} />
    },
    {
      header: "Actions",
      key: "actions",
      render: (r) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            style={{ background: 'var(--primary-yellow-light)', border: 'none', color: 'var(--accent-yellow-dark)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => setSelectedEnquiryForStage(r)}
            title="Update Lead Stage"
          >
            <Edit3 size={14} />
          </button>
          <button
            style={{ background: 'var(--danger-bg)', border: 'none', color: 'var(--danger-red)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => deleteEnquiry(r.enquiry_id)}
            title="Delete Enquiry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="leads-container">
      <div className="leads-header-row">
        <div>
          <h1 className="dashboard-title">Quote & Enquiry Lead Management</h1>
          <p className="dashboard-subtitle">Manage Get Quote submissions received from customer app & website</p>
        </div>
        <div className="header-action-group">
          <button
            className="btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} /> New Quote Lead
          </button>
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

      {/* Filter Bar */}
      <div className="leads-filter-bar">
        <CustomSelect
          icon={Filter}
          label="Stage:"
          value={selectedStageFilter}
          onChange={(val) => setSelectedStageFilter(val)}
          options={[
            { value: "ALL", label: `All Stages (${enquiries.length})`, badge: enquiries.length },
            ...STAGE_OPTIONS.map(stage => ({
              value: stage,
              label: stage,
              badge: enquiries.filter(e => e.lead_stage === stage).length
            }))
          ]}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredEnquiries}
        searchPlaceholder="Search client name, location, phone..."
        pageSize={8}
      />

      {/* Create Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Quote & Enquiry Lead"
      >
        <form onSubmit={handleCreateSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Phone *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.client_email}
              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Site Location *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g., Thindal, Erode"
              value={formData.site_location}
              onChange={(e) => setFormData({ ...formData, site_location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Structure Type</label>
            <select
              className="form-input"
              value={formData.structure_type}
              onChange={(e) => setFormData({ ...formData, structure_type: e.target.value })}
            >
              {STRUCTURE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Built-up Area (Sq. Ft.)</label>
            <input
              type="number"
              className="form-input"
              value={formData.builtup_area_sqft}
              onChange={(e) => setFormData({ ...formData, builtup_area_sqft: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cement Brand Preference</label>
            <input
              type="text"
              className="form-input"
              value={formData.cement_brand}
              onChange={(e) => setFormData({ ...formData, cement_brand: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Rate (Per Sq. Ft.)</label>
            <input
              type="text"
              className="form-input"
              value={formData.estimated_rate_per_sqft}
              onChange={(e) => setFormData({ ...formData, estimated_rate_per_sqft: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Estimated Cost (₹)</label>
            <input
              type="number"
              className="form-input"
              value={formData.total_estimated_cost}
              onChange={(e) => setFormData({ ...formData, total_estimated_cost: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lead Stage</label>
            <select
              className="form-input"
              value={formData.lead_stage}
              onChange={(e) => setFormData({ ...formData, lead_stage: e.target.value })}
            >
              {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Lead Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Stage Modal */}
      {selectedEnquiryForStage && (
        <Modal
          isOpen={!!selectedEnquiryForStage}
          onClose={() => setSelectedEnquiryForStage(null)}
          title={`Update Lead Stage for ${selectedEnquiryForStage.enquiry_id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong>Client:</strong> {selectedEnquiryForStage.client_name} ({selectedEnquiryForStage.site_location})
            </div>
            <div className="form-group">
              <label className="form-label">Select New Stage</label>
              <select
                className="form-input"
                defaultValue={selectedEnquiryForStage.lead_stage}
                onChange={(e) => {
                  updateEnquiryStage(selectedEnquiryForStage.enquiry_id, e.target.value);
                  setSelectedEnquiryForStage(null);
                }}
              >
                {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Quote & Enquiry Leads CSV"
        moduleName="Leads"
        compulsoryColumns={ENQUIRY_COLUMNS_SPEC}
        sampleRow={SAMPLE_ENQUIRY_ROW}
        onImport={(data) => importEnquiries(data)}
      />

      {/* CSV Export Modal */}
      <CSVExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Quote & Enquiry Leads CSV"
        moduleName="Quote & Enquiry Leads"
        columns={ENQUIRY_COLUMNS_SPEC}
        data={enquiries}
        onConfirmExport={() => exportToCSV(enquiries, 'Yeloline_Quotes_Leads')}
      />
    </div>
  );
}
