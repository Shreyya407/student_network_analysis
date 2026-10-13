import React from 'react';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { Layout } from './components/layout/Layout';

// 11 Core Pages
import { OverviewPage } from './components/pages/OverviewPage';
import { StudentNetworkPage } from './components/pages/StudentNetworkPage';
import { CommunitiesPage } from './components/pages/CommunitiesPage';
import { InfluentialStudentsPage } from './components/pages/InfluentialStudentsPage';
import { BridgeStudentsPage } from './components/pages/BridgeStudentsPage';
import { IsolatedStudentsPage } from './components/pages/IsolatedStudentsPage';
import { ConnectivityAnalysisPage } from './components/pages/ConnectivityAnalysisPage';
import { DepartmentsPage } from './components/pages/DepartmentsPage';
import { CentralityComparisonPage } from './components/pages/CentralityComparisonPage';
import { DataExplorerPage } from './components/pages/DataExplorerPage';
import { MethodologyPage } from './components/pages/MethodologyPage';

const AppContent: React.FC = () => {
  const { activeTab } = useNetwork();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'network':
        return <StudentNetworkPage />;
      case 'communities':
        return <CommunitiesPage />;
      case 'influential':
        return <InfluentialStudentsPage />;
      case 'bridges':
        return <BridgeStudentsPage />;
      case 'isolated':
        return <IsolatedStudentsPage />;
      case 'connectivity':
        return <ConnectivityAnalysisPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'centrality':
        return <CentralityComparisonPage />;
      case 'data':
        return <DataExplorerPage />;
      case 'methodology':
        return <MethodologyPage />;
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
