import React, { useState } from 'react';
import { Plus, Download, Upload, CheckCircle, CreditCard, Printer, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/common/DataTable/DataTable';
import Modal from '../../components/common/Modal/Modal';
import MetricCard from '../../components/common/MetricCard/MetricCard';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import CSVImportModal from '../../components/common/CSVImportModal/CSVImportModal';
import CSVExportModal from '../../components/common/CSVExportModal/CSVExportModal';
import './ClientPaymentsModule.css';

const MILESTONES = [
  "Booking / Advance",
  "Foundation Stage",
  "Plinth Beam Stage",
  "Slab Casting",
  "Brickwork & Plastering",
  "Finishing Stage",
  "Final Handover"
];

const PAYMENT_METHODS = [
  "UPI",
  "Bank Transfer (NEFT/RTGS)",
  "Cheque",
  "Cash"
];

const PAYMENT_COLUMNS_SPEC = [
  { key: "payment_id", label: "Payment ID", type: "String", required: true, example: "PAY-701" },
  { key: "client_name", label: "Client Full Name", type: "String", required: true, example: "Ramesh Sundaram" },
  { key: "project_name", label: "Site / Project Name", type: "String", required: true, example: "Modern Minimalist Villa - Perundurai" },
  { key: "amount_received", label: "Amount Received (₹)", type: "Number", required: true, example: "1500000" },
  { key: "payment_date", label: "Payment Date", type: "Date", required: true, example: "2026-09-10" },
  { key: "construction_milestone", label: "Construction Milestone", type: "String", required: true, example: "Plinth Beam Stage" },
  { key: "payment_method", label: "Payment Method", type: "String", required: true, example: "Bank Transfer (NEFT/RTGS)" },
  { key: "transaction_reference", label: "Transaction / UTR Ref", type: "String", required: true, example: "HDFC9823104921" },
  { key: "payment_receipt", label: "Receipt File", type: "String", required: false, example: "receipt_pay701.pdf" }
];

const SAMPLE_PAYMENT_ROW = {
  payment_id: "PAY-701",
  client_name: "Ramesh Sundaram",
  project_name: "Modern Minimalist Villa - Perundurai",
  amount_received: 1500000,
  payment_date: "2026-09-10",
  construction_milestone: "Plinth Beam Stage",
  payment_method: "Bank Transfer (NEFT/RTGS)",
  transaction_reference: "HDFC9823104921",
  payment_receipt: "receipt_pay701.pdf"
};

export default function ClientPaymentsModule() {
  const { payments, addPayment, importPayments, exportToCSV } = useApp();
  const [selectedMilestoneFilter, setSelectedMilestoneFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [receiptPreviewPayment, setReceiptPreviewPayment] = useState(null);

  const [formData, setFormData] = useState({
    client_name: '',
    project_name: '',
    amount_received: '',
    payment_date: new Date().toISOString().split('T')[0],
    construction_milestone: 'Booking / Advance',
    payment_method: 'Bank Transfer (NEFT/RTGS)',
    transaction_reference: '',
    payment_receipt: ''
  });

  const filteredPayments = selectedMilestoneFilter === 'ALL'
    ? payments
    : payments.filter(p => p.construction_milestone === selectedMilestoneFilter);

  const totalCollected = filteredPayments.reduce((acc, p) => acc + Number(p.amount_received || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPayment(formData);
    setIsModalOpen(false);
    setFormData({
      client_name: '',
      project_name: '',
      amount_received: '',
      payment_date: new Date().toISOString().split('T')[0],
      construction_milestone: 'Booking / Advance',
      payment_method: 'Bank Transfer (NEFT/RTGS)',
      transaction_reference: '',
      payment_receipt: ''
    });
  };

  const columns = [
    {
      header: "Payment ID",
      key: "payment_id",
      render: (r) => <span style={{ fontWeight: '700', color: 'var(--accent-yellow-dark)' }}>{r.payment_id}</span>
    },
    { header: "Client Name", key: "client_name", render: (r) => <strong>{r.client_name}</strong> },
    { header: "Project Title", key: "project_name" },
    {
      header: "Amount Received",
      key: "amount_received",
      render: (r) => <strong style={{ color: 'var(--success-green)' }}>₹{Number(r.amount_received).toLocaleString('en-IN')}</strong>
    },
    {
      header: "Milestone",
      key: "construction_milestone",
      render: (r) => (
        <span style={{ backgroundColor: 'var(--primary-yellow-light)', color: 'var(--accent-yellow-dark)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700' }}>
          {r.construction_milestone}
        </span>
      )
    },
    { header: "Method", key: "payment_method" },
    { header: "Date", key: "payment_date" },
    {
      header: "Receipt PDF",
      key: "actions",
      render: (r) => (
        <button
          style={{ background: 'var(--primary-yellow-light)', border: 'none', color: 'var(--accent-yellow-dark)', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
          onClick={() => setReceiptPreviewPayment(r)}
        >
          <Printer size={13} /> View Receipt
        </button>
      )
    }
  ];

  return (
    <div className="payments-container">
      <div className="leads-header-row">
        <div>
          <h1 className="dashboard-title">Client Payment & Milestone Tracking</h1>
          <p className="dashboard-subtitle">Record construction milestone payments and issue official PDF payment receipts</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Record New Payment
          </button>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', background: 'var(--light-card)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload size={16} /> Import CSV
          </button>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', background: 'var(--light-card)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stat */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <MetricCard
          title="Total Revenue Collected"
          value={`₹${(totalCollected / 100000).toFixed(2)} L`}
          icon={CreditCard}
          subtext="From construction milestone payouts"
          highlight
        />
        <MetricCard
          title="Milestone Receipts Issued"
          value={payments.length}
          icon={CheckCircle}
          subtext="Verified bank transfers & UPI"
        />
      </div>

      {/* Filter Bar */}
      <div className="leads-filter-bar">
        <CustomSelect
          icon={Filter}
          label="Milestone:"
          value={selectedMilestoneFilter}
          onChange={(val) => setSelectedMilestoneFilter(val)}
          options={[
            { value: "ALL", label: `All Milestones (${payments.length})`, badge: payments.length },
            ...MILESTONES.map(m => ({
              value: m,
              label: m,
              badge: payments.filter(p => p.milestone === m).length
            }))
          ]}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredPayments}
        searchPlaceholder="Search client, project, transaction ref..."
        pageSize={8}
      />

      {/* Create Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Client Milestone Payment"
      >
        <form onSubmit={handleSubmit} className="form-grid">
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
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount Received (₹) *</label>
            <input
              type="number"
              required
              className="form-input"
              value={formData.amount_received}
              onChange={(e) => setFormData({ ...formData, amount_received: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Construction Milestone</label>
            <select
              className="form-input"
              value={formData.construction_milestone}
              onChange={(e) => setFormData({ ...formData, construction_milestone: e.target.value })}
            >
              {MILESTONES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-input"
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            >
              {PAYMENT_METHODS.map(pm => <option key={pm} value={pm}>{pm}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Transaction Reference / UTR Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. HDFC9821039821 / GPay Ref"
              value={formData.transaction_reference}
              onChange={(e) => setFormData({ ...formData, transaction_reference: e.target.value })}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Record Payment
            </button>
          </div>
        </form>
      </Modal>

      {/* Payment Receipt PDF Simulator Preview Modal */}
      {receiptPreviewPayment && (
        <Modal
          isOpen={!!receiptPreviewPayment}
          onClose={() => setReceiptPreviewPayment(null)}
          title={`Official Payment Receipt - ${receiptPreviewPayment.payment_id}`}
        >
          <div className="receipt-modal-preview">
            <div className="receipt-header">
              <div>
                <strong style={{ fontSize: '1.2rem', color: 'var(--accent-yellow-dark)' }}>YELOLINE CONSTRUCTION</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Official Milestone Payment Receipt</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>Receipt #: {receiptPreviewPayment.payment_id}</div>
                <div>Date: {receiptPreviewPayment.payment_date}</div>
              </div>
            </div>

            <div className="receipt-row">
              <span className="form-label">Client Name:</span>
              <strong>{receiptPreviewPayment.client_name}</strong>
            </div>
            <div className="receipt-row">
              <span className="form-label">Project:</span>
              <span>{receiptPreviewPayment.project_name}</span>
            </div>
            <div className="receipt-row">
              <span className="form-label">Construction Milestone:</span>
              <strong style={{ color: 'var(--accent-yellow-dark)' }}>{receiptPreviewPayment.construction_milestone}</strong>
            </div>
            <div className="receipt-row">
              <span className="form-label">Payment Method:</span>
              <span>{receiptPreviewPayment.payment_method}</span>
            </div>
            <div className="receipt-row">
              <span className="form-label">Transaction Reference:</span>
              <span>{receiptPreviewPayment.transaction_reference || 'N/A'}</span>
            </div>
            <div className="receipt-row" style={{ fontSize: '1.1rem', marginTop: '8px', borderBottom: 'none' }}>
              <strong>Amount Paid:</strong>
              <strong style={{ color: 'var(--success-green)' }}>₹{Number(receiptPreviewPayment.amount_received).toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={16} /> Print / Save PDF
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Client Milestone Payments CSV"
        moduleName="Client Payments"
        compulsoryColumns={PAYMENT_COLUMNS_SPEC}
        sampleRow={SAMPLE_PAYMENT_ROW}
        onImport={(data) => importPayments(data)}
      />

      {/* CSV Export Modal */}
      <CSVExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Client Milestone Payments CSV"
        moduleName="Client Milestone Payments"
        columns={PAYMENT_COLUMNS_SPEC}
        data={payments}
        onConfirmExport={() => exportToCSV(payments, 'Yeloline_Milestone_Payments')}
      />
    </div>
  );
}
