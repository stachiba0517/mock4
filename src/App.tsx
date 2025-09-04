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
              <button className="btn-primary">+ 新規顧客追加</button>
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
              <button className="btn-primary">+ 新規案件追加</button>
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
