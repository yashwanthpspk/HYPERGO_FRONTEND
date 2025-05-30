import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { PropertyDashboard } from "./components/property-dashboard";
import { AddProperty } from "./components/add-property";
import { Icon } from "@iconify/react";
import { PropertyAnalytics } from "./components/property-analytics";
import { ThemeSwitcher } from "./components/theme-switcher";
import { propertyData } from "./data/property-data";

export default function App() {
  const [selected, setSelected] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-divider bg-content1">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:home" className="text-primary text-2xl" />
            <h1 className="text-xl font-semibold">Property Listing System</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Tabs 
          selectedKey={selected} 
          onSelectionChange={setSelected as any}
          className="mb-6"
          aria-label="Property management options"
        >
          <Tab 
            key="dashboard" 
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:layout-dashboard" />
                <span>Dashboard</span>
              </div>
            }
          />
          <Tab 
            key="analytics" 
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:bar-chart-2" />
                <span>Analytics</span>
              </div>
            }
          />
          <Tab 
            key="add" 
            title={
              <div className="flex items-center gap-2">
                <Icon icon="lucide:plus-circle" />
                <span>Add Property</span>
              </div>
            }
          />
        </Tabs>

        <div className="w-full">
          {selected === "dashboard" && <PropertyDashboard properties={propertyData} />}
          {selected === "analytics" && <PropertyAnalytics properties={propertyData} />}
          {selected === "add" && <AddProperty />}
        </div>
      </main>

      <footer className="w-full border-t border-divider bg-content1 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-default-500 text-sm">
          © 2024 Property Listing System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}