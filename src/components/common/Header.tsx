import React from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'ダッシュボード' },
    { id: 'customers', label: '顧客管理' },
    { id: 'opportunities', label: '営業案件' },
    { id: 'communications', label: '履歴管理' },
    { id: 'tasks', label: 'タスク管理' },
    { id: 'analytics', label: '売上分析' },
    { id: 'marketing', label: 'マーケティング' },
    { id: 'documents', label: '営業日報' },
    { id: 'reports', label: 'レポート' },
    { id: 'calendar', label: 'カレンダー' }
  ];

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <h1>CRM システム</h1>
        </div>
        <nav className="main-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
