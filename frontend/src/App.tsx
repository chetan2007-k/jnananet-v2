import React from "react";
import { useAppStore } from "./store/useAppStore";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

import { DashboardView } from "./views/DashboardView";
import { ScholarshipsView } from "./views/ScholarshipsView";
import { ComparisonView } from "./views/ComparisonView";
import { WhatIfSimulatorView } from "./views/WhatIfSimulatorView";
import { AiAssistantView } from "./views/AiAssistantView";
import { MyApplicationsView } from "./views/MyApplicationsView";
import { IdentityHubView } from "./views/IdentityHubView";
import { CalendarView } from "./views/CalendarView";

export const App: React.FC = () => {
  const { activeTab, comparisonList } = useAppStore();

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "scholarships":
        return <ScholarshipsView />;
      case "simulator":
        return <WhatIfSimulatorView />;
      case "assistant":
        return <AiAssistantView />;
      case "applications":
        return <MyApplicationsView />;
      case "identity":
        return <IdentityHubView />;
      case "calendar":
        return <CalendarView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 ">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;
