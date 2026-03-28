import React, { useMemo } from 'react';
import './style.scss';

const Tab = ({ tabs, activeKey, onChange }) => {
  const activeTab = useMemo(
    () => tabs.find((tab) => tab.key === activeKey),
    [tabs, activeKey]
  );

  return (
    <div className="tab-container">
      <div className="tab-header">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-item ${activeKey === tab.key ? 'active' : ''}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content" key={activeKey}>
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tab;