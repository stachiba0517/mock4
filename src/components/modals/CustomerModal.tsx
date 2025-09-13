import React from 'react';
import { Customer } from '../../types';

interface CustomerModalProps {
  isOpen: boolean;
  customer: Partial<Customer>;
  editingCustomer: Customer | null;
  onClose: () => void;
  onSave: () => void;
  onInputChange: (field: keyof Customer, value: string | number) => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  customer,
  editingCustomer,
  onClose,
  onSave,
  onInputChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingCustomer ? '顧客情報編集' : '新規顧客追加'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label>会社名 <span className="required">*</span></label>
              <input
                type="text"
                value={customer.companyName || ''}
                onChange={(e) => onInputChange('companyName', e.target.value)}
                placeholder="株式会社サンプル"
              />
            </div>
            
            <div className="form-group">
              <label>担当者名 <span className="required">*</span></label>
              <input
                type="text"
                value={customer.contactName || ''}
                onChange={(e) => onInputChange('contactName', e.target.value)}
                placeholder="田中 太郎"
              />
            </div>
            
            <div className="form-group">
              <label>役職</label>
              <input
                type="text"
                value={customer.position || ''}
                onChange={(e) => onInputChange('position', e.target.value)}
                placeholder="営業部長"
              />
            </div>
            
            <div className="form-group">
              <label>メールアドレス <span className="required">*</span></label>
              <input
                type="email"
                value={customer.email || ''}
                onChange={(e) => onInputChange('email', e.target.value)}
                placeholder="tanaka@sample.co.jp"
              />
            </div>
            
            <div className="form-group">
              <label>電話番号</label>
              <input
                type="tel"
                value={customer.phone || ''}
                onChange={(e) => onInputChange('phone', e.target.value)}
                placeholder="03-1234-5678"
              />
            </div>
            
            <div className="form-group">
              <label>住所</label>
              <input
                type="text"
                value={customer.address || ''}
                onChange={(e) => onInputChange('address', e.target.value)}
                placeholder="東京都渋谷区..."
              />
            </div>
            
            <div className="form-group">
              <label>業界</label>
              <select
                value={customer.industry || ''}
                onChange={(e) => onInputChange('industry', e.target.value)}
              >
                <option value="">業界を選択</option>
                <option value="IT・ソフトウェア">IT・ソフトウェア</option>
                <option value="製造業">製造業</option>
                <option value="金融・保険">金融・保険</option>
                <option value="商社・貿易">商社・貿易</option>
                <option value="デザイン・広告">デザイン・広告</option>
                <option value="建設・不動産">建設・不動産</option>
                <option value="医療・福祉">医療・福祉</option>
                <option value="教育">教育</option>
                <option value="その他">その他</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>企業規模</label>
              <select
                value={customer.companySize || ''}
                onChange={(e) => onInputChange('companySize', e.target.value)}
              >
                <option value="">企業規模を選択</option>
                <option value="小規模（50名未満）">小規模（50名未満）</option>
                <option value="中規模（100-500名）">中規模（100-500名）</option>
                <option value="大規模（500名以上）">大規模（500名以上）</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>年間売上（円）</label>
              <input
                type="number"
                value={customer.revenue || 0}
                onChange={(e) => onInputChange('revenue', parseInt(e.target.value) || 0)}
                placeholder="50000000"
              />
            </div>
            
            <div className="form-group">
              <label>ステータス</label>
              <select
                value={customer.status || '見込み客'}
                onChange={(e) => onInputChange('status', e.target.value)}
              >
                <option value="見込み客">見込み客</option>
                <option value="アクティブ">アクティブ</option>
                <option value="契約済み">契約済み</option>
                <option value="フォローアップ中">フォローアップ中</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>担当営業</label>
              <select
                value={customer.assignedSales || ''}
                onChange={(e) => onInputChange('assignedSales', e.target.value)}
              >
                <option value="">担当営業を選択</option>
                <option value="佐藤 花子">佐藤 花子</option>
                <option value="鈴木 一郎">鈴木 一郎</option>
                <option value="田村 正樹">田村 正樹</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>備考</label>
              <textarea
                value={customer.notes || ''}
                onChange={(e) => onInputChange('notes', e.target.value)}
                placeholder="顧客に関する特記事項..."
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
            {editingCustomer ? '顧客を更新' : '顧客を追加'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
