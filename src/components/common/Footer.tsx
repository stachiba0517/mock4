import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>&copy; 2024 CRM システム - 営業支援プラットフォーム</p>
      <div className="footer-links">
        <span>📱 モバイル対応</span>
        <span>🔗 外部システム連携</span>
        <span>🔒 セキュア</span>
      </div>
    </footer>
  );
};

export default Footer;
