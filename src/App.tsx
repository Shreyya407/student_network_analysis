import React from 'react';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './components/pages/OverviewPage';
import { StudentNetworkPage } from './components/pages/StudentNetworkPage';
import { InfluentialStudentsPage } from './components/pages/InfluentialStudentsPage';
import { NetworkIsolationPage } from './components/pages/NetworkIsolationPage';
import { CommunitiesPage } from './components/pages/CommunitiesPage';
import { DepartmentsPage } from './components/pages/DepartmentsPage';
import { MetricComparisonPage } from './components/pages/MetricComparisonPage';
import { MethodologyPage } from './components/pages/MethodologyPage';
import { DataPage } from './components/pages/DataPage';

const AppContent: React.FC = () => {
  const { activeTab } = useNetwork();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'network':
        return <StudentNetworkPage />;
      case 'influential':
        return <InfluentialStudentsPage />;
      case 'isolation':
        return <NetworkIsolationPage />;
      case 'communities':
        return <CommunitiesPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'comparison':
        return <MetricComparisonPage />;
      case 'methodology':
        return <MethodologyPage />;
      case 'data':
        return <DataPage />;
      default:
        return <OverviewPage />;
    }
  };

  return <Layout>{renderActivePage()}</Layout>;
};

export function App() {
  return (
    <NetworkProvider>
      <AppContent />
    </NetworkProvider>
  );
}

export default App;
