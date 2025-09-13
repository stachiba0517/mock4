import React from 'react';
import { CalendarEvent, Customer, SalesOpportunity } from '../../types';

interface CalendarModalProps {
  isOpen: boolean;
  event: Partial<CalendarEvent>;
  customers: Customer[];
  opportunities: SalesOpportunity[];
  onClose: () => void;
  onSave: () => void;
  onInputChange: (field: keyof CalendarEvent, value: string | number | null) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  event,
  customers,
  opportunities,
  onClose,
  onSave,
  onInputChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>新規予定追加</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>予定名 <span className="required">*</span></label>
              <input
                type="text"
                value={event.title || ''}
                onChange={(e) => onInputChange('title', e.target.value)}
                placeholder="顧客訪問・会議・デモ等"
              />
            </div>
            
            <div className="form-group">
              <label>種類</label>
              <select
                value={event.type || 'visit'}
                onChange={(e) => onInputChange('type', e.target.value)}
              >
                <option value="visit">🏢 顧客訪問</option>
                <option value="meeting">🤝 会議</option>
                <option value="call">📞 電話</option>
                <option value="demo">💻 デモ</option>
                <option value="other">📋 その他</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>日付 <span className="required">*</span></label>
              <input
                type="date"
                value={event.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => onInputChange('date', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>開始時間</label>
              <input
                type="time"
                value={event.startTime || '09:00'}
                onChange={(e) => onInputChange('startTime', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>終了時間</label>
              <input
                type="time"
                value={event.endTime || '10:00'}
                onChange={(e) => onInputChange('endTime', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>担当営業 <span className="required">*</span></label>
              <select
                value={event.assignedSales || ''}
                onChange={(e) => onInputChange('assignedSales', e.target.value)}
              >
                <option value="">担当営業を選択</option>
                <option value="佐藤 花子">佐藤 花子</option>
                <option value="鈴木 一郎">鈴木 一郎</option>
                <option value="田村 正樹">田村 正樹</option>
                <option value="営業部全員">営業部全員</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>関連顧客</label>
              <select
                value={event.customerId || 0}
                onChange={(e) => onInputChange('customerId', parseInt(e.target.value) || null)}
              >
                <option value={0}>顧客を選択（任意）</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>顧客名（手入力）</label>
              <input
                type="text"
                value={event.customerName || ''}
                onChange={(e) => onInputChange('customerName', e.target.value)}
                placeholder="新規顧客名など"
                disabled={!!event.customerId}
              />
            </div>
            
            <div className="form-group">
              <label>場所・住所</label>
              <input
                type="text"
                value={event.location || ''}
                onChange={(e) => onInputChange('location', e.target.value)}
                placeholder="東京都渋谷区... / オンライン / 電話会議"
              />
            </div>
            
            <div className="form-group">
              <label>関連案件</label>
              <select
                value={event.relatedOpportunityId || 0}
                onChange={(e) => onInputChange('relatedOpportunityId', parseInt(e.target.value) || null)}
              >
                <option value={0}>関連案件を選択（任意）</option>
                {opportunities.map(opp => (
                  <option key={opp.id} value={opp.id}>
                    {opp.title} - {opp.customerName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>ステータス</label>
              <select
                value={event.status || 'scheduled'}
                onChange={(e) => onInputChange('status', e.target.value)}
              >
                <option value="scheduled">予定</option>
                <option value="completed">完了</option>
                <option value="cancelled">キャンセル</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>詳細・説明</label>
              <textarea
                value={event.description || ''}
                onChange={(e) => onInputChange('description', e.target.value)}
                placeholder="会議の目的、議題、準備事項など..."
                rows={2}
              />
            </div>
            
            <div className="form-group full-width">
              <label>備考・メモ</label>
              <textarea
                value={event.notes || ''}
                onChange={(e) => onInputChange('notes', e.target.value)}
                placeholder="参加者、持参物、注意事項など..."
                rows={2}
              />
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn-primary" onClick={onSave}>
            予定を追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
