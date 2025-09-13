import React from 'react';
import { Customer } from '../../types';

interface CustomerManagementProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onViewCustomerDetail: (customer: Customer) => void;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onAddCustomer,
  onEditCustomer,
  onViewCustomerDetail
}) => {
  return (
    <div className="customer-management">
      <div className="section-header">
        <h2>👥 顧客データベース管理</h2>
        <button className="btn-primary" onClick={onAddCustomer}>+ 新規顧客追加</button>
      </div>
      
      <div className="filters">
        <input type="text" placeholder="顧客名で検索..." className="search-input" />
        <select className="filter-select">
          <option>全てのステータス</option>
          <option>アクティブ</option>
          <option>見込み客</option>
          <option>契約済み</option>
          <option>フォローアップ中</option>
        </select>
      </div>

      <div className="customer-table">
        <table>
          <thead>
            <tr>
              <th>会社名</th>
              <th>担当者</th>
              <th>業界</th>
              <th>ステータス</th>
              <th>担当営業</th>
              <th>最終コンタクト</th>
              <th>アクション</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="company-info">
                    <h4>{customer.companyName}</h4>
                    <p>{customer.companySize}</p>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <h4>{customer.contactName}</h4>
                    <p>{customer.position}</p>
                    <p>{customer.email}</p>
                  </div>
                </td>
                <td>{customer.industry}</td>
                <td>
                  <span className={`status-badge status-${customer.status.replace(/\s+/g, '-')}`}>
                    {customer.status}
                  </span>
                </td>
                <td>{customer.assignedSales}</td>
                <td>{customer.lastContact}</td>
                <td>
                  <button className="btn-small" onClick={() => onViewCustomerDetail(customer)}>詳細</button>
                  <button className="btn-small" onClick={() => onEditCustomer(customer)}>編集</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerManagement;
