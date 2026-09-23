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
import UserMasterModule from './modules/user_master/UserMasterModule';
import AdminMasterModule from './modules/admin_master/AdminMasterModule';
import ContactEnquiryModule from './modules/contact_enquiry/ContactEnquiryModule';
import SplashLoader from './components/common/SplashLoader/SplashLoader';
import './App.css';

function MainRouter() {
  const { isAuthenticated, activeTab, isSplashLoading, handleSplashComplete } = useApp();

  if (isSplashLoading) {
    return <SplashLoader onComplete={handleSplashComplete} />;
  }

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
      case 'contact_enquiry':
        return <ContactEnquiryModule />;
      case 'user_master':
        return <UserMasterModule />;
      case 'admin_master':
        return <AdminMasterModule />;
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
