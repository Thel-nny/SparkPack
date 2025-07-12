"use client";

import React, { useState, ReactNode } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId }) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  if (!tabs || tabs.length === 0) {
    return null; // Or render a message indicating no tabs
  }

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="flex border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`
              py-3 px-6 text-lg font-semibold transition-colors duration-200
              ${activeTabId === tab.id
                ? 'text-[#8cc63f] border-b-2 border-[#8cc63f]'
                : 'text-gray-600 hover:text-[#342d47] hover:border-gray-300'
              }
            `}
            role="tab"
            aria-selected={activeTabId === tab.id}
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTabId === tab.id ? 'block' : 'hidden'}`}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;