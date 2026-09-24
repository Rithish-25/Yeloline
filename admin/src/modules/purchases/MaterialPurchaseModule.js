import React, { useState } from 'react';
import { Plus, Download, Upload, ShoppingBag, Truck, CheckCircle2, Filter, Eye, FileSpreadsheet, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DataTable from '../../components/common/DataTable/DataTable';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import Modal from '../../components/common/Modal/Modal';
import MetricCard from '../../components/common/MetricCard/MetricCard';
import CustomSelect from '../../components/common/CustomSelect/CustomSelect';
import CSVImportModal from '../../components/common/CSVImportModal/CSVImportModal';
import CSVExportModal from '../../components/common/CSVExportModal/CSVExportModal';
import './MaterialPurchaseModule.css';

const MATERIAL_CATEGORIES = [
  "Cement",
  "Steel / TMT Bars",
  "Bricks & Blocks",
  "Sand & Aggregates",
  "Tiles & Flooring",
  "Paint",
  "Electrical Wiring",
  "Plumbing Fittings"
];

const UNITS = ["Bags", "Tons", "Units", "Sq. Ft.", "Liters", "Truck Load"];
const DELIVERY_STATUSES = ["Ordered", "In Transit", "Delivered", "Partial"];
const PAYMENT_STATUSES = ["Unpaid", "Partially Paid", "Paid"];

const PURCHASE_COLUMNS_SPEC = [
  { key: "purchase_id", label: "PO Ref ID", type: "String", required: true, example: "PO-301" },
  { key: "vendor_name", label: "Vendor Name", type: "String", required: true, example: "UltraTech Cement Depot" },
  { key: "material_category", label: "Material Category", type: "String", required: true, example: "Cement" },
  { key: "quantity", label: "Quantity", type: "Number", required: true, example: "450" },
  { key: "unit", label: "Unit", type: "String", required: true, example: "Bags" },
  { key: "unit_price", label: "Unit Price (₹)", type: "Number", required: true, example: "410" },
  { key: "total_amount", label: "Total Amount (₹)", type: "Number", required: true, example: "184500" },
  { key: "invoice_number", label: "Invoice Number", type: "String", required: true, example: "INV-UTC-9921" },
  { key: "order_date", label: "Order Date", type: "Date", required: true, example: "2026-09-18" },
  { key: "delivery_status", label: "Delivery Status", type: "String", required: true, example: "Delivered" },
  { key: "payment_status", label: "Payment Status", type: "String", required: true, example: "Paid" }
];

const SAMPLE_PURCHASE_ROW = {
  purchase_id: "PO-301",
  vendor_name: "UltraTech Cement Depot Erode",
  material_category: "Cement",
  quantity: 450,
  unit: "Bags",
  unit_price: 410,
  total_amount: 184500,
  invoice_number: "INV-UTC-9921",
  order_date: "2026-09-18",
  delivery_status: "Delivered",
  payment_status: "Paid"
};

export default function MaterialPurchaseModule() {
  const { purchases, addPurchase, updatePurchaseDeliveryStatus, importPurchases, exportToCSV } = useApp();
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [viewingDetailPurchase, setViewingDetailPurchase] = useState(null);

  const [formData, setFormData] = useState({
    vendor_name: '',
    material_category: 'Cement',
    quantity: 100,
    unit: 'Bags',
    unit_price: 400,
    invoice_number: '',
    delivery_status: 'Ordered',
    payment_status: 'Unpaid'
  });

  const filteredPurchases = selectedMaterialFilter === 'ALL'
    ? purchases
    : purchases.filter(p => p.material_category === selectedMaterialFilter);

  const totalPOAmount = filteredPurchases.reduce((acc, p) => acc + Number(p.total_amount || 0), 0);
  const deliveredCount = purchases.filter(p => p.delivery_status === 'Delivered').length;
  const transitCount = purchases.filter(p => p.delivery_status === 'In Transit').length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const total_amount = Number(formData.quantity) * Number(formData.unit_price);
    addPurchase({ ...formData, total_amount });
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: "PO ID",
      key: "purchase_id",
      render: (r) => <span style={{ fontWeight: '700', color: 'var(--accent-yellow-dark)' }}>{r.purchase_id}</span>
    },
    { header: "Vendor Name", key: "vendor_name", render: (r) => <strong>{r.vendor_name}</strong> },
    { header: "Category", key: "material_category" },
    {
      header: "Quantity",
      key: "quantity",
      render: (r) => `${r.quantity} ${r.unit}`
    },
    {
      header: "Unit Price",
      key: "unit_price",
      render: (r) => `₹${Number(r.unit_price).toLocaleString('en-IN')}`
    },
    {
      header: "Total Amount",
      key: "total_amount",
      render: (r) => <strong>₹{Number(r.total_amount).toLocaleString('en-IN')}</strong>
    },
    { header: "Invoice #", key: "invoice_number" },
    {
      header: "Delivery Status",
      key: "delivery_status",
      render: (r) => (
        <select
          className="filter-select"
          style={{ padding: '2px 6px', fontSize: '0.78rem' }}
          value={r.delivery_status}
          onChange={(e) => updatePurchaseDeliveryStatus(r.purchase_id, e.target.value)}
        >
          {DELIVERY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )
    },
    {
      header: "Payment Status",
      key: "payment_status",
      render: (r) => <StatusBadge status={r.payment_status} />
    },
    {
      header: "Actions",
      key: "actions",
      render: (r) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            style={{ background: 'var(--info-bg)', border: 'none', color: 'var(--info-blue)', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => setViewingDetailPurchase(r)}
            title="View Full Purchase Order Details"
          >
            <Eye size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="purchases-container">
      <div className="leads-header-row">
        <div>
          <h1 className="dashboard-title">Material Purchase Orders</h1>
          <p className="dashboard-subtitle">Record and track construction material orders, vendor invoices & delivery status</p>
        </div>
        <div className="header-action-group">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Create Purchase Order
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

      {/* PO Summary Metrics */}
      <div className="po-summary-grid">
        <MetricCard
          title="Total PO Spend"
          value={`₹${(totalPOAmount / 100000).toFixed(2)} L`}
          icon={ShoppingBag}
          subtext={`${filteredPurchases.length} Purchase Orders`}
          highlight
        />
        <MetricCard
          title="Delivered Orders"
          value={deliveredCount}
          icon={CheckCircle2}
          subtext="On-site material received"
        />
        <MetricCard
          title="In Transit Shipments"
          value={transitCount}
          icon={Truck}
          subtext="En-route to site location"
        />
      </div>

      {/* Filter Bar */}
      <div className="leads-filter-bar">
        <CustomSelect
          icon={Filter}
          label="Material:"
          value={selectedMaterialFilter}
          onChange={(val) => setSelectedMaterialFilter(val)}
          options={[
            { value: "ALL", label: `All Materials (${purchases.length})`, badge: purchases.length },
            ...MATERIAL_CATEGORIES.map(m => ({
              value: m,
              label: m,
              badge: purchases.filter(p => p.item_category === m).length
            }))
          ]}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredPurchases}
        searchPlaceholder="Search vendor name, invoice #, material..."
        pageSize={8}
        onRowClick={(row) => setViewingDetailPurchase(row)}
      />

      {/* Create Purchase Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Material Purchase Order"
      >
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Vendor / Supplier Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.vendor_name}
              onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Material Category</label>
            <select
              className="form-input"
              value={formData.material_category}
              onChange={(e) => setFormData({ ...formData, material_category: e.target.value })}
            >
              {MATERIAL_CATEGORIES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-input"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit of Measure</label>
            <select
              className="form-input"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Unit Price (₹)</label>
            <input
              type="number"
              className="form-input"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Invoice Number</label>
            <input
              type="text"
              className="form-input"
              value={formData.invoice_number}
              onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Status</label>
            <select
              className="form-input"
              value={formData.delivery_status}
              onChange={(e) => setFormData({ ...formData, delivery_status: e.target.value })}
            >
              {DELIVERY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Status</label>
            <select
              className="form-input"
              value={formData.payment_status}
              onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
            >
              {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Issue Purchase Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Purchase Detail Modal */}
      {viewingDetailPurchase && (
        <Modal
          isOpen={!!viewingDetailPurchase}
          onClose={() => setViewingDetailPurchase(null)}
          title={`Material Purchase Order Details - ${viewingDetailPurchase.purchase_id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{viewingDetailPurchase.vendor_name}</h2>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Invoice: <strong>{viewingDetailPurchase.invoice_number || 'N/A'}</strong>
                </div>
              </div>
              <StatusBadge status={viewingDetailPurchase.payment_status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Item Category</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--accent-yellow-dark)' }}>
                  {viewingDetailPurchase.item_category}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Quantity</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  {viewingDetailPurchase.quantity} {viewingDetailPurchase.unit}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Unit Price</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  ₹{Number(viewingDetailPurchase.unit_price).toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', background: 'var(--light-background)', border: '1px solid var(--light-border)', borderRadius: 'var(--radius-sm)' }}>
                <div className="form-label" style={{ marginBottom: '4px' }}>Delivery Status</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  {viewingDetailPurchase.delivery_status}
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.15), rgba(234, 179, 8, 0.08))', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '700', color: 'var(--dark-charcoal)' }}>Total Purchase Amount:</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--accent-yellow-dark)' }}>
                ₹{Number(viewingDetailPurchase.total_amount).toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setViewingDetailPurchase(null)}>
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
        title="Import Material Purchase Orders CSV"
        moduleName="Material Purchases"
        compulsoryColumns={PURCHASE_COLUMNS_SPEC}
        sampleRow={SAMPLE_PURCHASE_ROW}
        onImport={(data) => importPurchases(data)}
      />

      {/* CSV Export Modal */}
      <CSVExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Material Purchase Orders CSV"
        moduleName="Material Purchase Orders"
        columns={PURCHASE_COLUMNS_SPEC}
        data={purchases}
        onConfirmExport={() => exportToCSV(purchases, 'Yeloline_Material_Purchases')}
      />
    </div>
  );
}
