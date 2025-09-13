import React from 'react';
import { Customer, Communication } from '../../types';

interface CustomerDetailProps {
  customer: Customer;
  communications: Communication[];
  onBack: () => void;
  onEdit: (customer: Customer) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({
  customer,
  communications,
  onBack,
  onEdit
}) => {
  return (
    <div className="customer-detail-page">
      <div className="detail-page-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ← 顧客管理に戻る
          </button>
          <div className="page-title">
            <h2>📋 顧客詳細情報</h2>
            <p>{customer.companyName} の詳細情報と取引履歴</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => onEdit(customer)}>
            編集する
          </button>
        </div>
      </div>

      <div className="detail-page-content">
        {/* 顧客基礎情報セクション */}
        <div className="customer-info-fullscreen">
          <h3>📋 基礎情報</h3>
          <div className="info-grid-fullscreen">
            <div className="info-section">
              <h4>🏢 企業情報</h4>
              <div className="info-table">
                <div className="info-row">
                  <span className="info-label">会社名</span>
                  <span className="info-value">{customer.companyName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">業界</span>
                  <span className="info-value">{customer.industry}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">企業規模</span>
                  <span className="info-value">{customer.companySize}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">年間売上</span>
                  <span className="info-value">¥{customer.revenue.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">住所</span>
                  <span className="info-value">{customer.address}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">ステータス</span>
                  <span className={`status-badge status-${customer.status.replace(/\s+/g, '-')}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h4>👤 担当者情報</h4>
              <div className="info-table">
                <div className="info-row">
                  <span className="info-label">担当者名</span>
                  <span className="info-value">{customer.contactName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">役職</span>
                  <span className="info-value">{customer.position}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">メールアドレス</span>
                  <span className="info-value">
                    <a href={`mailto:${customer.email}`}>{customer.email}</a>
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">電話番号</span>
                  <span className="info-value">
                    <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                  </span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h4>📊 営業情報</h4>
              <div className="info-table">
                <div className="info-row">
                  <span className="info-label">担当営業</span>
                  <span className="info-value">{customer.assignedSales}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">登録日</span>
                  <span className="info-value">{customer.createdDate}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">最終コンタクト</span>
                  <span className="info-value">{customer.lastContact}</span>
                </div>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div className="notes-section">
              <h4>📝 備考・特記事項</h4>
              <div className="notes-content">
                <p>{customer.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* 取引履歴セクション */}
        <div className="transaction-history-fullscreen">
          <div className="history-header">
            <h3>📊 取引履歴・コミュニケーション履歴</h3>
            <div className="history-summary">
              <div className="summary-item">
                <span className="summary-label">総コミュニケーション数</span>
                <span className="summary-value">
                  {communications.filter(comm => comm.customerId === customer.id).length}件
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">最終コンタクト</span>
                <span className="summary-value">{customer.lastContact}</span>
              </div>
            </div>
          </div>

          <div className="history-filters-fullscreen">
            <select className="filter-select">
              <option>全ての種類</option>
              <option>電話</option>
              <option>メール</option>
              <option>会議</option>
              <option>訪問</option>
            </select>
            <input type="date" className="date-input" />
            <span>〜</span>
            <input type="date" className="date-input" />
            <button className="btn-secondary">フィルター適用</button>
          </div>

          <div className="history-timeline-fullscreen">
            {communications
              .filter(comm => comm.customerId === customer.id)
              .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
              .map((comm) => (
                <div key={comm.id} className="timeline-item-fullscreen">
                  <div className="timeline-date-column">
                    <div className="timeline-date">{comm.date}</div>
                    <div className="timeline-time">{comm.time}</div>
                  </div>
                  <div className="timeline-icon-column">
                    <div className="timeline-icon-large">
                      {comm.type === '電話' && '📞'}
                      {comm.type === 'メール' && '📧'}
                      {comm.type === '会議' && '🤝'}
                      {comm.type === '訪問' && '🏢'}
                    </div>
                    <div className="timeline-type">{comm.type}</div>
                  </div>
                  <div className="timeline-content-column">
                    <div className="timeline-header-fullscreen">
                      <h4>{comm.subject}</h4>
                      <span className={`priority-badge priority-${comm.priority}`}>
                        {comm.priority}
                      </span>
                    </div>
                    <div className="timeline-summary-fullscreen">
                      <p>{comm.summary}</p>
                    </div>
                    <div className="timeline-details">
                      {comm.participants.length > 0 && (
                        <div className="detail-item">
                          <strong>参加者:</strong> {comm.participants.join(', ')}
                        </div>
                      )}
                      {comm.duration && (
                        <div className="detail-item">
                          <strong>所要時間:</strong> {comm.duration}分
                        </div>
                      )}
                      {comm.nextAction && (
                        <div className="detail-item">
                          <strong>次のアクション:</strong> {comm.nextAction}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            {communications.filter(comm => comm.customerId === customer.id).length === 0 && (
              <div className="no-history-fullscreen">
                <div className="no-history-icon">📭</div>
                <h4>まだコミュニケーション履歴がありません</h4>
                <p>この顧客との最初のコンタクトを記録しましょう。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
