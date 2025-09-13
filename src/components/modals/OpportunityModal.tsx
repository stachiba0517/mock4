import React from 'react';
import { SalesOpportunity, Customer } from '../../types';

interface OpportunityModalProps {
  isOpen: boolean;
  opportunity: Partial<SalesOpportunity>;
  customers: Customer[];
  onClose: () => void;
  onSave: () => void;
  onInputChange: (field: keyof SalesOpportunity, value: string | number | string[]) => void;
}

const OpportunityModal: React.FC<OpportunityModalProps> = ({
  isOpen,
  opportunity,
  customers,
  onClose,
  onSave,
  onInputChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>新規営業案件追加</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>案件名 <span className="required">*</span></label>
              <input
                type="text"
                value={opportunity.title || ''}
                onChange={(e) => onInputChange('title', e.target.value)}
                placeholder="CRMシステム導入プロジェクト"
              />
            </div>
            
            <div className="form-group">
              <label>顧客 <span className="required">*</span></label>
              <select
                value={opportunity.customerId || 0}
                onChange={(e) => onInputChange('customerId', parseInt(e.target.value))}
              >
                <option value={0}>顧客を選択</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>営業ステージ</label>
              <select
                value={opportunity.stage || '初回商談'}
                onChange={(e) => onInputChange('stage', e.target.value)}
              >
                <option value="初回商談">初回商談</option>
                <option value="ニーズ確認">ニーズ確認</option>
                <option value="技術検証">技術検証</option>
                <option value="提案書作成">提案書作成</option>
                <option value="契約交渉">契約交渉</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>受注確度（%）</label>
              <input
                type="number"
                min="0"
                max="100"
                value={opportunity.probability || 30}
                onChange={(e) => onInputChange('probability', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="form-group">
              <label>案件金額（円） <span className="required">*</span></label>
              <input
                type="number"
                value={opportunity.value || 0}
                onChange={(e) => onInputChange('value', parseInt(e.target.value) || 0)}
                placeholder="5000000"
              />
            </div>
            
            <div className="form-group">
              <label>予定クローズ日</label>
              <input
                type="date"
                value={opportunity.expectedCloseDate || ''}
                onChange={(e) => onInputChange('expectedCloseDate', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>担当営業</label>
              <select
                value={opportunity.assignedSales || ''}
                onChange={(e) => onInputChange('assignedSales', e.target.value)}
              >
                <option value="">担当営業を選択</option>
                <option value="佐藤 花子">佐藤 花子</option>
                <option value="鈴木 一郎">鈴木 一郎</option>
                <option value="田村 正樹">田村 正樹</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>次のアクション</label>
              <input
                type="text"
                value={opportunity.nextAction || ''}
                onChange={(e) => onInputChange('nextAction', e.target.value)}
                placeholder="提案書作成"
              />
            </div>
            
            <div className="form-group">
              <label>競合情報</label>
              <input
                type="text"
                value={opportunity.competitorInfo || ''}
                onChange={(e) => onInputChange('competitorInfo', e.target.value)}
                placeholder="Salesforce検討中"
              />
            </div>
            
            <div className="form-group">
              <label>決裁者（カンマ区切り）</label>
              <input
                type="text"
                value={opportunity.decisionMakers?.join(', ') || ''}
                onChange={(e) => onInputChange('decisionMakers', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                placeholder="田中 太郎, 営業部副部長 鈴木氏"
              />
            </div>
            
            <div className="form-group full-width">
              <label>案件詳細</label>
              <textarea
                value={opportunity.description || ''}
                onChange={(e) => onInputChange('description', e.target.value)}
                placeholder="営業チーム向けCRMシステムの導入。50ユーザーライセンス。"
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn-primary" onClick={onSave}>
            案件を追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityModal;
