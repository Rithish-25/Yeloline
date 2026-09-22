import React, { useState } from 'react';
import { Plus, Download, Upload, Trash2, Paperclip, DollarSign, Filter, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/common/DataTable/DataTable';
import Modal from '../../components/common/Modal/Modal';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import CSVImportModal from '../../components/common/CSVImportModal/CSVImportModal';
import CSVExportModal from '../../components/common/CSVExportModal/CSVExportModal';
import './SiteExpensesModule.css';

const EXPENSE_CATEGORIES = [
  "Labor Wages",
  "Equipment Rental",
  "Permits & Licenses",
  "Subcontractor",
  "Utilities",
  "Transportation",
  "Miscellaneous"
];

const PAYMENT_MODES = ["Cash", "UPI", "Bank Transfer", "Cheque"];

const EXPENSE_COLUMNS_SPEC = [
  { key: "expense_id", label: "Expense ID", type: "String", required: true, example: "EXP-801" },
  { key: "site_name", label: "Site / Project Name", type: "String", required: true, example: "Modern Minimalist Villa - Perundurai" },
  { key: "category", label: "Category", type: "String", required: true, example: "Labor Wages" },
  { key: "amount", label: "Amount (₹)", type: "Number", required: true, example: "85000" },
  { key: "date", label: "Payment Date", type: "Date", required: true, example: "2026-09-18" },
  { key: "payment_mode", label: "Payment Mode", type: "String", required: true, example: "Bank Transfer" },
  { key: "notes", label: "Notes / Purpose", type: "String", required: false, example: "Weekly mason payout" },
  { key: "receipt_attachment", label: "Receipt File", type: "String", required: false, example: "receipt_wages.pdf" }
];

const SAMPLE_EXPENSE_ROW = {
  expense_id: "EXP-801",
  site_name: "Modern Minimalist Villa - Perundurai",
  category: "Labor Wages",
  amount: 85000,
  date: "2026-09-18",
  payment_mode: "Bank Transfer",
  notes: "Weekly mason payout",
  receipt_attachment: "receipt_wages_sep18.pdf"
};

export default function SiteExpensesModule() {
  const { expenses, addExpense, deleteExpense, importExpenses, exportToCSV } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [viewingDetailExpense, setViewingDetailExpense] = useState(null);

  const [formData, setFormData] = useState({
    site_name: '',
    category: 'Labor Wages',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    payment_mode: 'Bank Transfer',
    notes: '',
    receipt_attachment: ''
  });

  const filteredExpenses = selectedCategory === 'ALL'
    ? expenses
    : expenses.filter(e => e.category === selectedCategory);

  const totalExpenseSum = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense(formData);
    setIsModalOpen(false);
    setFormData({
      site_name: 'Modern Minimalist Villa - Perundurai',
      category: 'Labor Wages',
      amount: 50000,
      date: new Date().toISOString().split('T')[0],
      payment_mode: 'UPI',
      notes: '',
      receipt_attachment: ''
    });
  };

  const columns = [
    {
      header: "Expense ID",
      key: "expense_id",
      render: (r) => <span style={{ fontWeight: '700', color: 'var(--accent-yellow-dark)' }}>{r.expense_id}</span>
    },
    { header: "Construction Site", key: "site_name", render: (r) => <strong>{r.site_name}</strong> },
    {
      header: "Category",
      key: "category",
      render: (r) => (
        <span style={{ backgroundColor: 'var(--primary-yellow-light)', color: 'var(--accent-yellow-dark)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700' }}>
          {r.category}
        </span>
      )
    },
    {
      header: "Amount",
      key: "amount",
      render: (r) => <strong style={{ color: 'var(--danger-red)' }}>₹{Number(r.amount).toLocaleString('en-IN')}</strong>
    },
    { header: "Payment Mode", key: "payment_mode" },
    { header: "Date", key: "date" },
    {
      header: "Receipt",
      key: "receipt_attachment",
      render: (r) => r.receipt_attachment ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--info-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Paperclip size={12} /> {r.receipt_attachment}
        </span>
      ) : <span style={{ color: 'var(--text-muted)' }}>None</span>
    },
    {
      header: "Actions",
      key: "actions",
      render: (r) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            style={{ background: 'var(--info-bg)', border: 'none', color: 'var(--info-blue)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => setViewingDetailExpense(r)}
            title="View Full Expense Details"
          >
            <Eye size={14} />
          </button>
          <button
            style={{ background: 'var(--danger-bg)', border: 'none', color: 'var(--danger-red)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => deleteExpense(r.expense_id)}
            title="Delete Entry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="expenses-container">
      <div className="leads-header-row">
        <div>
          <h1 className="dashboard-title">Site Expense Tracker</h1>
          <p className="dashboard-subtitle">Log, categorize, and aggregate daily site operational expenses</p>
        </div>
        <div className="header-action-group">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Log New Expense
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

      {/* Expense Aggregation Banner */}
      <div className="expense-summary-card">
        <div>
          <div className="expense-total-label">Total Aggregated Site Expenses ({selectedCategory})</div>
          <div className="expense-total-amount">₹{totalExpenseSum.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', padding: '8px 14px', borderRadius: '8px' }}>
          <DollarSign size={20} style={{ color: 'var(--primary-yellow)' }} />
          <span style={{ fontSize: '0.85rem' }}>{filteredExpenses.length} Logged Entries</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="leads-filter-bar">
        <CustomSelect
          icon={Filter}
          label="Category:"
          value={selectedCategory}
          onChange={(val) => setSelectedCategory(val)}
          options={[
            { value: "ALL", label: `All Categories (${expenses.length})`, badge: expenses.length },
            ...EXPENSE_CATEGORIES.map(cat => ({
              value: cat,
              label: cat,
              badge: expenses.filter(e => e.category === cat).length
            }))
          ]}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredExpenses}
        searchPlaceholder="Search site name, category, receipt..."
        pageSize={8}
        onRowClick={(row) => setViewingDetailExpense(row)}
      />

      {/* Create Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Site Operational Expense"
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Construction Site Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <input
              type="number"
              required
              className="form-input"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              required
              className="form-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Mode</label>
            <select
              className="form-input"
              value={formData.payment_mode}
              onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
            >
              {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Receipt File Name / Ref</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. receipt_bill_sep20.pdf"
              value={formData.receipt_attachment}
              onChange={(e) => setFormData({ ...formData, receipt_attachment: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Notes / Remarks</label>
            <input
              type="text"
              className="form-input"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Log Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Expense Detail Modal */}
      {viewingDetailExpense && (
        <Modal
          isOpen={!!viewingDetailExpense}
          onClose={() => setViewingDetailExpense(null)}
          title={`Site Expense Details - ${viewingDetailExpense.expense_id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{viewingDetailExpense.site_name}</h2>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Category: <strong style={{ color: 'var(--accent-yellow-dark)' }}>{viewingDetailExpense.category}</strong>
                </div>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--danger-red)' }}>
                ₹{Number(viewingDetailExpense.amount).toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Payment Mode</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  {viewingDetailExpense.payment_mode}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Payment Date</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  {viewingDetailExpense.date}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Receipt Attachment</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: viewingDetailExpense.receipt_attachment ? 'var(--info-blue)' : 'var(--text-muted)' }}>
                  {viewingDetailExpense.receipt_attachment || 'No Receipt Attached'}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Expense ID</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--accent-yellow-dark)' }}>
                  {viewingDetailExpense.expense_id}
                </div>
              </div>
            </div>

            {viewingDetailExpense.notes && (
              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Notes & Purpose</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {viewingDetailExpense.notes}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setViewingDetailExpense(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Site Expenses CSV"
        moduleName="Site Expenses"
        compulsoryColumns={EXPENSE_COLUMNS_SPEC}
        sampleRow={SAMPLE_EXPENSE_ROW}
        onImport={(data) => importExpenses(data)}
      />

      {/* CSV Export Modal */}
      <CSVExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Site Expenses CSV"
        moduleName="Site Expenses"
        columns={EXPENSE_COLUMNS_SPEC}
        data={expenses}
        onConfirmExport={() => exportToCSV(expenses, 'Yeloline_Site_Expenses')}
      />
    </div>
  );
}
