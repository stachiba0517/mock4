import React, { useState, useEffect } from 'react';
import './App.css';

// データ型定義
interface Customer {
  id: number;
  companyName: string;
  contactName: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  companySize: string;
  revenue: number;
  status: string;
  assignedSales: string;
  createdDate: string;
  lastContact: string;
  notes: string;
}

interface SalesOpportunity {
  id: number;
  title: string;
  customerId: number;
  customerName: string;
  stage: string;
  probability: number;
  value: number;
  expectedCloseDate: string;
  assignedSales: string;
  createdDate: string;
  lastActivity: string;
  description: string;
  nextAction: string;
  competitorInfo: string;
  decisionMakers: string[];
}

interface Communication {
  id: number;
  customerId: number;
  customerName: string;
  type: string;
  date: string;
  time: string;
  duration: number | null;
  subject: string;
  summary: string;
  participants: string[];
  nextAction: string;
  priority: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  customerId: number | null;
  customerName: string | null;
  assignedTo: string;
  priority: string;
  status: string;
  dueDate: string;
  createdDate: string;
  completedDate: string | null;
  type: string;
  relatedOpportunityId: number | null;
}

interface Analytics {
  salesForecast: {
    currentMonth: {
      target: number;
      achieved: number;
      progress: number;
      remaining: number;
    };
    quarterlyForecast: Array<{
      month: string;
      target: number;
      achieved: number;
      forecast: number;
    }>;
  };
  pipelineAnalysis: {
    totalValue: number;
    weightedValue: number;
    averageDealSize: number;
    conversionRate: number;
    salesCycle: number;
    stageDistribution: Array<{
      stage: string;
      count: number;
      value: number;
      probability: number;
    }>;
  };
  salesPerformance: {
    totalRevenue: number;
    salesTeam: Array<{
      name: string;
      target: number;
      achieved: number;
      progress: number;
      deals: number;
      avgDealSize: number;
    }>;
  };
  customerAnalysis: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomersThisMonth: number;
    customerRetentionRate: number;
    industryDistribution: Array<{
      industry: string;
      count: number;
      percentage: number;
    }>;
    companySizeDistribution: Array<{
      size: string;
      count: number;
      percentage: number;
    }>;
  };
  activityMetrics: {
    totalCalls: number;
    totalEmails: number;
    totalMeetings: number;
    totalVisits: number;
    averageResponseTime: number;
    monthlyActivity: Array<{
      month: string;
      calls: number;
      emails: number;
      meetings: number;
      visits: number;
    }>;
  };
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    companyName: '',
    contactName: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    companySize: '',
    revenue: 0,
    status: '見込み客',
    assignedSales: '',
    notes: ''
  });
  const [newOpportunity, setNewOpportunity] = useState<Partial<SalesOpportunity>>({
    title: '',
    customerId: 0,
    customerName: '',
    stage: '初回商談',
    probability: 30,
    value: 0,
    expectedCloseDate: '',
    assignedSales: '',
    description: '',
    nextAction: '',
    competitorInfo: '',
    decisionMakers: []
  });

  // データ読み込み
  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersRes, opportunitiesRes, communicationsRes, tasksRes, analyticsRes] = await Promise.all([
          fetch('/api/customers.json'),
          fetch('/api/sales-opportunities.json'),
          fetch('/api/communications.json'),
          fetch('/api/tasks.json'),
          fetch('/api/analytics.json')
        ]);

        const [customersData, opportunitiesData, communicationsData, tasksData, analyticsData] = await Promise.all([
          customersRes.json(),
          opportunitiesRes.json(),
          communicationsRes.json(),
          tasksRes.json(),
          analyticsRes.json()
        ]);

        setCustomers(customersData);
        setOpportunities(opportunitiesData);
        setCommunications(communicationsData);
        setTasks(tasksData);
        setAnalytics(analyticsData);
        setLoading(false);
      } catch (error) {
        console.error('データ読み込みエラー:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 顧客追加ハンドラー
  const handleAddCustomer = () => {
    if (!newCustomer.companyName || !newCustomer.contactName || !newCustomer.email) {
      alert('必須項目を入力してください。');
      return;
    }

    const customer: Customer = {
      id: Math.max(...customers.map(c => c.id), 0) + 1,
      companyName: newCustomer.companyName || '',
      contactName: newCustomer.contactName || '',
      position: newCustomer.position || '',
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      address: newCustomer.address || '',
      industry: newCustomer.industry || '',
      companySize: newCustomer.companySize || '',
      revenue: newCustomer.revenue || 0,
      status: newCustomer.status || '見込み客',
      assignedSales: newCustomer.assignedSales || '',
      createdDate: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      notes: newCustomer.notes || ''
    };

    setCustomers([...customers, customer]);
    setShowCustomerModal(false);
    setNewCustomer({
      companyName: '',
      contactName: '',
      position: '',
      email: '',
      phone: '',
      address: '',
      industry: '',
      companySize: '',
      revenue: 0,
      status: '見込み客',
      assignedSales: '',
      notes: ''
    });
  };

  // 顧客入力値更新ハンドラー
  const handleInputChange = (field: keyof Customer, value: string | number) => {
    setNewCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 営業案件追加ハンドラー
  const handleAddOpportunity = () => {
    if (!newOpportunity.title || !newOpportunity.customerId || !newOpportunity.value) {
      alert('必須項目を入力してください。');
      return;
    }

    const selectedCustomer = customers.find(c => c.id === newOpportunity.customerId);
    if (!selectedCustomer) {
      alert('有効な顧客を選択してください。');
      return;
    }

    const opportunity: SalesOpportunity = {
      id: Math.max(...opportunities.map(o => o.id), 0) + 1,
      title: newOpportunity.title || '',
      customerId: newOpportunity.customerId || 0,
      customerName: selectedCustomer.companyName,
      stage: newOpportunity.stage || '初回商談',
      probability: newOpportunity.probability || 30,
      value: newOpportunity.value || 0,
      expectedCloseDate: newOpportunity.expectedCloseDate || '',
      assignedSales: newOpportunity.assignedSales || '',
      createdDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      description: newOpportunity.description || '',
      nextAction: newOpportunity.nextAction || '',
      competitorInfo: newOpportunity.competitorInfo || '',
      decisionMakers: newOpportunity.decisionMakers || []
    };

    setOpportunities([...opportunities, opportunity]);
    setShowOpportunityModal(false);
    setNewOpportunity({
      title: '',
      customerId: 0,
      customerName: '',
      stage: '初回商談',
      probability: 30,
      value: 0,
      expectedCloseDate: '',
      assignedSales: '',
      description: '',
      nextAction: '',
      competitorInfo: '',
      decisionMakers: []
    });
  };

  // 営業案件入力値更新ハンドラー
  const handleOpportunityInputChange = (field: keyof SalesOpportunity, value: string | number | string[]) => {
    setNewOpportunity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>CRMシステムを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="App">
            <header className="app-header">
        <div className="header-container">
          <div className="header-brand">
            <h1>CRM システム</h1>
          </div>
          <nav className="main-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              ダッシュボード
            </button>
            <button 
              className={`nav-btn ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              顧客管理
            </button>
            <button 
              className={`nav-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
              onClick={() => setActiveTab('opportunities')}
            >
              営業案件
            </button>
            <button 
              className={`nav-btn ${activeTab === 'communications' ? 'active' : ''}`}
              onClick={() => setActiveTab('communications')}
            >
              履歴管理
            </button>
            <button 
              className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              タスク管理
            </button>
            <button 
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              売上分析
            </button>
            <button 
              className={`nav-btn ${activeTab === 'marketing' ? 'active' : ''}`}
              onClick={() => setActiveTab('marketing')}
            >
              マーケティング
            </button>
            <button 
              className={`nav-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              文書作成
            </button>
            <button 
              className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              レポート
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="dashboard-header">
              <h2>📊 CRMダッシュボード</h2>
              <p>営業活動の全体像を把握できます</p>
            </div>

            {analytics && (
              <div className="dashboard-grid">
                <div className="kpi-cards">
                  <div className="kpi-card">
                    <h3>今月の売上目標</h3>
                    <div className="kpi-value">¥{analytics.salesForecast.currentMonth.target.toLocaleString()}</div>
                    <div className="kpi-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${analytics.salesForecast.currentMonth.progress}%`}}></div>
                      </div>
                      <span>{analytics.salesForecast.currentMonth.progress}% 達成</span>
                </div>
              </div>
                  
                  <div className="kpi-card">
                    <h3>パイプライン総額</h3>
                    <div className="kpi-value">¥{analytics.pipelineAnalysis.totalValue.toLocaleString()}</div>
                    <div className="kpi-sub">加重値: ¥{analytics.pipelineAnalysis.weightedValue.toLocaleString()}</div>
                </div>
                  
                  <div className="kpi-card">
                    <h3>アクティブ顧客</h3>
                    <div className="kpi-value">{analytics.customerAnalysis.activeCustomers}</div>
                    <div className="kpi-sub">総顧客数: {analytics.customerAnalysis.totalCustomers}</div>
              </div>
                  
                  <div className="kpi-card">
                    <h3>今月のタスク</h3>
                    <div className="kpi-value">{tasks.filter(t => t.status !== '完了').length}</div>
                    <div className="kpi-sub">完了: {tasks.filter(t => t.status === '完了').length}件</div>
                </div>
              </div>

                <div className="pipeline-section">
                  <h3>🎯 営業パイプライン</h3>
                  <div className="pipeline-stages">
                    {analytics.pipelineAnalysis.stageDistribution.map((stage, index) => (
                      <div key={index} className="pipeline-stage">
                        <div className="stage-header">
                          <h4>{stage.stage}</h4>
                          <span className="stage-count">{stage.count}件</span>
                        </div>
                        <div className="stage-value">¥{stage.value.toLocaleString()}</div>
                        <div className="stage-probability">{stage.probability}% 確度</div>
                </div>
                    ))}
              </div>
            </div>

                <div className="team-performance">
                  <h3>👥 営業チーム実績</h3>
                  <div className="performance-list">
                    {analytics.salesPerformance.salesTeam.map((member, index) => (
                      <div key={index} className="performance-item">
                        <div className="member-info">
                          <h4>{member.name}</h4>
                          <div className="member-stats">
                            <span>目標: ¥{member.target.toLocaleString()}</span>
                            <span>実績: ¥{member.achieved.toLocaleString()}</span>
                            <span>達成率: {member.progress}%</span>
                </div>
                </div>
                        <div className="member-progress">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: `${member.progress}%`}}></div>
                </div>
              </div>
            </div>
                    ))}
              </div>
            </div>

                <div className="recent-activities">
                  <h3>📝 最近の活動</h3>
                  <div className="activity-list">
                    {communications.slice(0, 5).map((comm, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">
                          {comm.type === '電話' && '📞'}
                          {comm.type === 'メール' && '📧'}
                          {comm.type === '会議' && '🤝'}
                          {comm.type === '訪問' && '🏢'}
                  </div>
                        <div className="activity-content">
                          <h4>{comm.subject}</h4>
                          <p>{comm.customerName} - {comm.date}</p>
                    </div>
                        <div className={`priority-badge priority-${comm.priority}`}>
                          {comm.priority}
                  </div>
                </div>
              ))}
            </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="customer-management">
            <div className="section-header">
              <h2>👥 顧客データベース管理</h2>
              <button className="btn-primary" onClick={() => setShowCustomerModal(true)}>+ 新規顧客追加</button>
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
                        <button className="btn-small">編集</button>
                        <button className="btn-small btn-secondary">履歴</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
        )}

                {activeTab === 'opportunities' && (
          <div className="sales-opportunities">
            <div className="section-header">
              <h2>🎯 営業プロセス・案件管理</h2>
              <button className="btn-primary" onClick={() => setShowOpportunityModal(true)}>+ 新規案件追加</button>
            </div>

            <div className="opportunities-kanban">
              {analytics && analytics.pipelineAnalysis.stageDistribution.map((stage, stageIndex) => (
                <div key={stageIndex} className="kanban-column">
                  <div className="column-header">
                    <h3>{stage.stage}</h3>
                    <span className="stage-count">{stage.count}件 (¥{stage.value.toLocaleString()})</span>
                  </div>
                  <div className="opportunity-cards">
                    {opportunities
                      .filter(opp => opp.stage === stage.stage)
                      .map((opportunity) => (
                        <div key={opportunity.id} className="opportunity-card">
                          <h4>{opportunity.title}</h4>
                          <p className="customer-name">{opportunity.customerName}</p>
                          <div className="opportunity-value">¥{opportunity.value.toLocaleString()}</div>
                          <div className="opportunity-meta">
                            <div className="probability">確度: {opportunity.probability}%</div>
                            <div className="close-date">予定: {opportunity.expectedCloseDate}</div>
                  </div>
                          <div className="assigned-sales">担当: {opportunity.assignedSales}</div>
                          <div className="next-action">
                            <strong>次のアクション:</strong> {opportunity.nextAction}
                  </div>
                  </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* その他のタブは簡略版で表示 */}
        {activeTab === 'communications' && (
          <div className="communication-history">
            <h2>💬 コミュニケーション履歴管理</h2>
            <p>顧客との全ての接触履歴を時系列で管理します。</p>
            <div className="feature-placeholder">
              <h3>主な機能:</h3>
              <ul>
                <li>電話、メール、会議、訪問の記録</li>
                <li>時系列での履歴表示</li>
                <li>次のアクション設定</li>
                <li>優先度管理</li>
              </ul>
              </div>
            </div>
        )}

        {activeTab === 'tasks' && (
          <div className="task-schedule">
            <h2>📅 タスク・スケジュール管理</h2>
            <p>営業活動に関するタスクを効率的に管理します。</p>
            <div className="feature-placeholder">
              <h3>主な機能:</h3>
              <ul>
                <li>フォローアップタスク管理</li>
                <li>アポイントメント管理</li>
                <li>締切管理</li>
                <li>優先度別表示</li>
              </ul>
                </div>
              </div>
            )}

        {activeTab === 'analytics' && (
          <div className="sales-analytics">
            <h2>📈 売上予測・分析機能</h2>
            <p>過去のデータから売上予測を立て、営業実績を分析します。</p>
            <div className="feature-placeholder">
              <h3>主な機能:</h3>
              <ul>
                <li>売上予測レポート</li>
                <li>営業実績分析</li>
                <li>KPI管理</li>
                <li>トレンド分析</li>
              </ul>
                              </div>
                            </div>
        )}

        {activeTab === 'marketing' && (
          <div className="marketing-automation">
            <h2>🚀 マーケティングオートメーション</h2>
            <p>メール配信、キャンペーン管理、リードナーチャリングを自動化します。</p>
            <div className="feature-placeholder">
              <h3>主な機能:</h3>
              <ul>
                <li>メールキャンペーン管理</li>
                <li>リードナーチャリング</li>
                <li>スコアリング機能</li>
                <li>自動化ワークフロー</li>
              </ul>
                </div>
              </div>
            )}

        {activeTab === 'documents' && (
          <div className="document-generator">
            <h2>📄 見積書・提案書作成</h2>
            <p>顧客データと連動した見積書や提案書を効率的に作成・管理します。</p>
            <div className="feature-placeholder">
              <h3>主な機能:</h3>
              <ul>
                <li>テンプレート管理</li>
                <li>自動データ連携</li>
                <li>承認フロー</li>
                <li>PDF出力</li>
              </ul>
                </div>
              </div>
            )}

        {activeTab === 'reports' && (
          <div className="reports-dashboard">
            <h2>📊 レポート・ダッシュボード</h2>
            <p>営業実績、顧客分析、活動状況を視覚的に表示します。</p>
            <div className="feature-placeholder">
              <h3>主な機能:</h3>
              <ul>
                <li>営業実績レポート</li>
                <li>顧客分析ダッシュボード</li>
                <li>活動状況レポート</li>
                <li>カスタムレポート作成</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* 新規顧客追加モーダル */}
      {showCustomerModal && (
        <div className="modal-overlay" onClick={() => setShowCustomerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>新規顧客追加</h3>
              <button className="modal-close" onClick={() => setShowCustomerModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>会社名 <span className="required">*</span></label>
                  <input
                    type="text"
                    value={newCustomer.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="株式会社サンプル"
                  />
                </div>
                
                <div className="form-group">
                  <label>担当者名 <span className="required">*</span></label>
                  <input
                    type="text"
                    value={newCustomer.contactName || ''}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="田中 太郎"
                  />
                </div>
                
                <div className="form-group">
                  <label>役職</label>
                  <input
                    type="text"
                    value={newCustomer.position || ''}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="営業部長"
                  />
                </div>
                
                <div className="form-group">
                  <label>メールアドレス <span className="required">*</span></label>
                  <input
                    type="email"
                    value={newCustomer.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tanaka@sample.co.jp"
                  />
                </div>
                
                <div className="form-group">
                  <label>電話番号</label>
                  <input
                    type="tel"
                    value={newCustomer.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="03-1234-5678"
                  />
                </div>
                
                <div className="form-group">
                  <label>住所</label>
                  <input
                    type="text"
                    value={newCustomer.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="東京都渋谷区..."
                  />
                </div>
                
                <div className="form-group">
                  <label>業界</label>
                  <select
                    value={newCustomer.industry || ''}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
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
                    value={newCustomer.companySize || ''}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
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
                    value={newCustomer.revenue || 0}
                    onChange={(e) => handleInputChange('revenue', parseInt(e.target.value) || 0)}
                    placeholder="50000000"
                  />
                </div>
                
                <div className="form-group">
                  <label>ステータス</label>
                  <select
                    value={newCustomer.status || '見込み客'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
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
                    value={newCustomer.assignedSales || ''}
                    onChange={(e) => handleInputChange('assignedSales', e.target.value)}
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
                    value={newCustomer.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="顧客に関する特記事項..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCustomerModal(false)}>
                キャンセル
              </button>
              <button className="btn-primary" onClick={handleAddCustomer}>
                顧客を追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新規営業案件追加モーダル */}
      {showOpportunityModal && (
        <div className="modal-overlay" onClick={() => setShowOpportunityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>新規営業案件追加</h3>
              <button className="modal-close" onClick={() => setShowOpportunityModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>案件名 <span className="required">*</span></label>
                  <input
                    type="text"
                    value={newOpportunity.title || ''}
                    onChange={(e) => handleOpportunityInputChange('title', e.target.value)}
                    placeholder="CRMシステム導入プロジェクト"
                  />
                </div>
                
                <div className="form-group">
                  <label>顧客 <span className="required">*</span></label>
                  <select
                    value={newOpportunity.customerId || 0}
                    onChange={(e) => handleOpportunityInputChange('customerId', parseInt(e.target.value))}
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
                    value={newOpportunity.stage || '初回商談'}
                    onChange={(e) => handleOpportunityInputChange('stage', e.target.value)}
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
                    value={newOpportunity.probability || 30}
                    onChange={(e) => handleOpportunityInputChange('probability', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="form-group">
                  <label>案件金額（円） <span className="required">*</span></label>
                  <input
                    type="number"
                    value={newOpportunity.value || 0}
                    onChange={(e) => handleOpportunityInputChange('value', parseInt(e.target.value) || 0)}
                    placeholder="5000000"
                  />
                </div>
                
                <div className="form-group">
                  <label>予定クローズ日</label>
                  <input
                    type="date"
                    value={newOpportunity.expectedCloseDate || ''}
                    onChange={(e) => handleOpportunityInputChange('expectedCloseDate', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>担当営業</label>
                  <select
                    value={newOpportunity.assignedSales || ''}
                    onChange={(e) => handleOpportunityInputChange('assignedSales', e.target.value)}
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
                    value={newOpportunity.nextAction || ''}
                    onChange={(e) => handleOpportunityInputChange('nextAction', e.target.value)}
                    placeholder="提案書作成"
                  />
                </div>
                
                <div className="form-group">
                  <label>競合情報</label>
                  <input
                    type="text"
                    value={newOpportunity.competitorInfo || ''}
                    onChange={(e) => handleOpportunityInputChange('competitorInfo', e.target.value)}
                    placeholder="Salesforce検討中"
                  />
                </div>
                
                <div className="form-group">
                  <label>決裁者（カンマ区切り）</label>
                  <input
                    type="text"
                    value={newOpportunity.decisionMakers?.join(', ') || ''}
                    onChange={(e) => handleOpportunityInputChange('decisionMakers', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    placeholder="田中 太郎, 営業部副部長 鈴木氏"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>案件詳細</label>
                  <textarea
                    value={newOpportunity.description || ''}
                    onChange={(e) => handleOpportunityInputChange('description', e.target.value)}
                    placeholder="営業チーム向けCRMシステムの導入。50ユーザーライセンス。"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowOpportunityModal(false)}>
                キャンセル
              </button>
              <button className="btn-primary" onClick={handleAddOpportunity}>
                案件を追加
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>&copy; 2024 CRM システム - 営業支援プラットフォーム</p>
        <div className="footer-links">
          <span>📱 モバイル対応</span>
          <span>🔗 外部システム連携</span>
          <span>🔒 セキュア</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
