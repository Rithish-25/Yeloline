import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AdminLayout from './components/layout/AdminLayout/AdminLayout';
import Login from './modules/auth/Login/Login';
import DashboardModule from './modules/dashboard/DashboardModule';
import LeadManagementModule from './modules/leads/LeadManagementModule';
import PortfolioProjectModule from './modules/projects/PortfolioProjectModule';
import SiteExpensesModule from './modules/expenses/SiteExpensesModule';
import MaterialPurchaseModule from './modules/purchases/MaterialPurchaseModule';
import ClientPaymentsModule from './modules/payments/ClientPaymentsModule';
import AppointmentsModule from './modules/appointments/AppointmentsModule';
import './App.css';

function MainRouter() {
  const { isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule />;
      case 'lead_management':
        return <LeadManagementModule />;
      case 'project_showcase':
        return <PortfolioProjectModule />;
      case 'site_expenses':
        return <SiteExpensesModule />;
      case 'material_purchase':
        return <MaterialPurchaseModule />;
      case 'client_payments':
        return <ClientPaymentsModule />;
      case 'renovation_appointments':
        return <AppointmentsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <AdminLayout>
      {renderActiveModule()}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
