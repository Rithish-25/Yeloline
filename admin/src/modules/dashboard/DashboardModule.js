import React, { useState } from 'react';
import {
  FileText,
  Building2,
  TrendingUp,
  Receipt,
  ShoppingCart,
  Calendar,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import MetricCard from '../../components/common/MetricCard/MetricCard';
import DataTable from '../../components/common/DataTable/DataTable';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import CSVExportModal from '../../components/common/CSVExportModal/CSVExportModal';
import './DashboardModule.css';

const FINANCIAL_COLUMNS_SPEC = [
  { key: "enquiry_id", label: "Enquiry ID", type: "String", required: true, example: "ENQ-2026-001" },
  { key: "client_name", label: "Client Full Name", type: "String", required: true, example: "Ramesh Sundaram" },
  { key: "site_location", label: "Site Address", type: "String", required: true, example: "Perundurai Road, Erode" },
  { key: "structure_type", label: "Structure Type", type: "String", required: true, example: "Villa" },
  { key: "total_estimated_cost", label: "Total Cost (₹)", type: "Number", required: true, example: "7200000" },
  { key: "enquiry_date", label: "Enquiry Date", type: "Date", required: true, example: "2026-09-18" },
  { key: "lead_stage", label: "Lead Stage", type: "String", required: true, example: "Estimate Shared" }
];

// Custom Chart Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <div className="tooltip-header">{label} Financials</div>
        <div className="tooltip-body">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="tooltip-row">
              <span className="tooltip-dot" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="tooltip-label">{entry.name}:</span>
              <span className="tooltip-value">₹{(entry.value / 100000).toFixed(2)}L</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function DashboardModule() {
  const {
    enquiries,
    projects,
    expenses,
    purchases,
    payments,
    appointments,
    monthlyFinancialOverview,
    exportToCSV
  } = useApp();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Calculations
  const totalRevenue = payments.reduce((acc, p) => acc + Number(p.amount_received || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const totalPurchases = purchases.reduce((acc, p) => acc + Number(p.total_amount || 0), 0);
  const pendingAppointments = appointments.filter(a => a.status !== 'Completed').length;

  const quoteColumns = [
    { header: "Client Name", key: "client_name", render: (r) => <strong style={{ whiteSpace: 'nowrap' }}>{r.client_name}</strong> },
    { header: "Location", key: "site_location", render: (r) => <span style={{ whiteSpace: 'nowrap' }}>{r.site_location}</span> },
    { header: "Structure", key: "structure_type", render: (r) => <span style={{ whiteSpace: 'nowrap' }}>{r.structure_type}</span> },
    { header: "Est. Rate", key: "estimated_rate_per_sqft", render: (r) => <span style={{ whiteSpace: 'nowrap' }}>{r.estimated_rate_per_sqft}</span> },
    { header: "Date", key: "enquiry_date", render: (r) => <span style={{ whiteSpace: 'nowrap' }}>{r.enquiry_date}</span> },
    { header: "Status", key: "lead_stage", render: (r) => <StatusBadge status={r.lead_stage} /> }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard & Financial Analytics</h1>
          <p className="dashboard-subtitle">Real-time site metrics, quote leads, and financial summary overview</p>
        </div>
        <div className="header-action-group">
          <button className="btn-primary" onClick={() => setIsExportModalOpen(true)}>
            <Download size={16} /> Export Financial CSV
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="dashboard-metrics-grid">
        <MetricCard
          title="Total Quotes Received"
          value={enquiries.length}
          icon={FileText}
          trend="+18%"
          subtext="vs last month"
          highlight
        />
        <MetricCard
          title="Active Projects"
          value={projects.length}
          icon={Building2}
          trend="+2"
          subtext="Under active execution"
        />
        <MetricCard
          title="Revenue Collected"
          value={`₹${(totalRevenue / 100000).toFixed(2)}L`}
          icon={TrendingUp}
          trend="+24%"
          subtext="From client milestone payments"
        />
        <MetricCard
          title="Total Site Expenses"
          value={`₹${(totalExpenses / 1000).toFixed(1)}k`}
          icon={Receipt}
          subtext="Labor, equipment, utilities"
        />
        <MetricCard
          title="Material Purchase Total"
          value={`₹${(totalPurchases / 100000).toFixed(2)}L`}
          icon={ShoppingCart}
          subtext="Cement, TMT steel, bricks"
        />
        <MetricCard
          title="Pending Appointments"
          value={pendingAppointments}
          icon={Calendar}
          subtext="Renovation Van site visits"
        />
      </div>

      {/* Analytics Chart & Breakdown */}
      <div className="dashboard-analytics-row">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Monthly Financial Comparison (₹)</h3>
              <p className="chart-card-subtitle">Revenue vs Expenses vs Purchases</p>
            </div>
            <div className="chart-legend-pills">
              <div className="legend-pill">
                <span className="legend-dot revenue" />
                <span>Revenue</span>
              </div>
              <div className="legend-pill">
                <span className="legend-dot expenses" />
                <span>Expenses</span>
              </div>
              <div className="legend-pill">
                <span className="legend-dot purchases" />
                <span>Purchases</span>
              </div>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFinancialOverview} margin={{ top: 15, right: 15, left: 0, bottom: 5 }} barGap={6}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity={1} />
                    <stop offset="100%" stopColor="#BE123C" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="purchasesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }}
                  dy={8}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(v) => `₹${v/100000}L`}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                <Bar dataKey="revenue" name="Revenue Collected" fill="url(#revenueGrad)" radius={[6, 6, 0, 0]} maxBarSize={26} />
                <Bar dataKey="expenses" name="Site Expenses" fill="url(#expensesGrad)" radius={[6, 6, 0, 0]} maxBarSize={26} />
                <Bar dataKey="purchases" name="Material Purchases" fill="url(#purchasesGrad)" radius={[6, 6, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="quick-stats-card">
          <h3 className="chart-card-title">Operational Highlights</h3>
          
          <div className="quick-stat-item">
            <div>
              <div className="quick-stat-label">Conversion Rate</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leads Converted to Site Projects</div>
            </div>
            <div className="quick-stat-val">34.2%</div>
          </div>

          <div className="quick-stat-item">
            <div>
              <div className="quick-stat-label">Avg. Quote Estimate</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Per residential structure</div>
            </div>
            <div className="quick-stat-val">₹57.2 L</div>
          </div>

          <div className="quick-stat-item">
            <div>
              <div className="quick-stat-label">Materials Delivered</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PO fulfillment rate</div>
            </div>
            <div className="quick-stat-val" style={{ color: 'var(--success-green)' }}>88.5%</div>
          </div>

          <div className="quick-stat-item">
            <div>
              <div className="quick-stat-label">Site Van Bookings</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scheduled this week</div>
            </div>
            <div className="quick-stat-val">14 Visits</div>
          </div>
        </div>
      </div>

      {/* Recent Quote Requests Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="chart-card-title">Recent Quote Requests (Latest 5)</h3>
        <DataTable
          columns={quoteColumns}
          data={enquiries.slice(0, 5)}
          pageSize={5}
        />
      </div>

      {/* CSV Export Modal */}
      <CSVExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Financial Analytics & Leads CSV"
        moduleName="Financial Overview & Leads"
        columns={FINANCIAL_COLUMNS_SPEC}
        data={enquiries}
        onConfirmExport={() => exportToCSV(enquiries, 'Yeloline_Dashboard_Export')}
      />
    </div>
  );
}
