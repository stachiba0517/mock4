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

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  type: 'visit' | 'meeting' | 'call' | 'demo' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  assignedSales: string;
  customerId: number | null;
  customerName: string | null;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
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
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showCustomerDetailPage, setShowCustomerDetailPage] = useState(false);
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
  const [newCalendarEvent, setNewCalendarEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    type: 'visit',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    assignedSales: '',
    customerId: null,
    customerName: '',
    location: '',
    status: 'scheduled',
    notes: '',
    relatedOpportunityId: null
  });

  // データ読み込み
  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersRes, opportunitiesRes, communicationsRes, tasksRes, analyticsRes, calendarRes] = await Promise.all([
          fetch('/api/customers.json'),
          fetch('/api/sales-opportunities.json'),
          fetch('/api/communications.json'),
          fetch('/api/tasks.json'),
          fetch('/api/analytics.json'),
          fetch('/api/calendar-events.json')
        ]);

        const [customersData, opportunitiesData, communicationsData, tasksData, analyticsData, calendarData] = await Promise.all([
          customersRes.json(),
          opportunitiesRes.json(),
          communicationsRes.json(),
          tasksRes.json(),
          analyticsRes.json(),
          calendarRes.json()
        ]);

        setCustomers(customersData);
        setOpportunities(opportunitiesData);
        setCommunications(communicationsData);
        setTasks(tasksData);
        setAnalytics(analyticsData);
        setCalendarEvents(calendarData);
        setLoading(false);
      } catch (error) {
        console.error('データ読み込みエラー:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 顧客追加・更新ハンドラー
  const handleAddCustomer = () => {
    if (!newCustomer.companyName || !newCustomer.contactName || !newCustomer.email) {
      alert('必須項目を入力してください。');
      return;
    }

    if (editingCustomer) {
      // 既存顧客の更新
      const updatedCustomer: Customer = {
        ...editingCustomer,
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
        lastContact: new Date().toISOString().split('T')[0],
        notes: newCustomer.notes || ''
      };

      setCustomers(customers.map(c => c.id === editingCustomer.id ? updatedCustomer : c));
    } else {
      // 新規顧客の追加
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
    }

    setShowCustomerModal(false);
    setEditingCustomer(null);
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

  // 顧客編集ハンドラー
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomer({
      companyName: customer.companyName,
      contactName: customer.contactName,
      position: customer.position,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      industry: customer.industry,
      companySize: customer.companySize,
      revenue: customer.revenue,
      status: customer.status,
      assignedSales: customer.assignedSales,
      notes: customer.notes
    });
    setShowCustomerModal(true);
  };

  // 顧客詳細表示ハンドラー（別ページ表示）
  const handleViewCustomerDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetailPage(true);
  };

  // 顧客詳細ページから戻る
  const handleBackToCustomers = () => {
    setShowCustomerDetailPage(false);
    setSelectedCustomer(null);
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

  // カレンダーイベント追加ハンドラー
  const handleAddCalendarEvent = () => {
    if (!newCalendarEvent.title || !newCalendarEvent.date || !newCalendarEvent.assignedSales) {
      alert('必須項目を入力してください。');
      return;
    }

    const calendarEvent: CalendarEvent = {
      id: Math.max(...calendarEvents.map(e => e.id), 0) + 1,
      title: newCalendarEvent.title || '',
      description: newCalendarEvent.description || '',
      type: newCalendarEvent.type || 'visit',
      date: newCalendarEvent.date || '',
      startTime: newCalendarEvent.startTime || '09:00',
      endTime: newCalendarEvent.endTime || '10:00',
      assignedSales: newCalendarEvent.assignedSales || '',
      customerId: newCalendarEvent.customerId || null,
      customerName: newCalendarEvent.customerId ? 
        customers.find(c => c.id === newCalendarEvent.customerId)?.companyName || '' : 
        newCalendarEvent.customerName || '',
      location: newCalendarEvent.location || '',
      status: newCalendarEvent.status || 'scheduled',
      notes: newCalendarEvent.notes || '',
      relatedOpportunityId: newCalendarEvent.relatedOpportunityId || null
    };

    setCalendarEvents([...calendarEvents, calendarEvent]);
    setShowCalendarModal(false);
    setNewCalendarEvent({
      title: '',
      description: '',
      type: 'visit',
      date: selectedDate,
      startTime: '09:00',
      endTime: '10:00',
      assignedSales: '',
      customerId: null,
      customerName: '',
      location: '',
      status: 'scheduled',
      notes: '',
      relatedOpportunityId: null
    });
  };

  // カレンダーイベント入力値更新ハンドラー
  const handleCalendarInputChange = (field: keyof CalendarEvent, value: string | number | null) => {
    setNewCalendarEvent(prev => ({
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
            <button 
              className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              カレンダー
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {showCustomerDetailPage && selectedCustomer ? (
          <div className="customer-detail-page">
            <div className="detail-page-header">
              <div className="header-left">
                <button className="back-btn" onClick={handleBackToCustomers}>
                  ← 顧客管理に戻る
                </button>
                <div className="page-title">
                  <h2>📋 顧客詳細情報</h2>
                  <p>{selectedCustomer.companyName} の詳細情報と取引履歴</p>
                </div>
              </div>
              <div className="header-actions">
                <button className="btn-primary" onClick={() => {
                  setShowCustomerDetailPage(false);
                  handleEditCustomer(selectedCustomer);
                }}>
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
                        <span className="info-value">{selectedCustomer.companyName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">業界</span>
                        <span className="info-value">{selectedCustomer.industry}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">企業規模</span>
                        <span className="info-value">{selectedCustomer.companySize}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">年間売上</span>
                        <span className="info-value">¥{selectedCustomer.revenue.toLocaleString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">住所</span>
                        <span className="info-value">{selectedCustomer.address}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">ステータス</span>
                        <span className={`status-badge status-${selectedCustomer.status.replace(/\s+/g, '-')}`}>
                          {selectedCustomer.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>👤 担当者情報</h4>
                    <div className="info-table">
                      <div className="info-row">
                        <span className="info-label">担当者名</span>
                        <span className="info-value">{selectedCustomer.contactName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">役職</span>
                        <span className="info-value">{selectedCustomer.position}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">メールアドレス</span>
                        <span className="info-value">
                          <a href={`mailto:${selectedCustomer.email}`}>{selectedCustomer.email}</a>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">電話番号</span>
                        <span className="info-value">
                          <a href={`tel:${selectedCustomer.phone}`}>{selectedCustomer.phone}</a>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>📊 営業情報</h4>
                    <div className="info-table">
                      <div className="info-row">
                        <span className="info-label">担当営業</span>
                        <span className="info-value">{selectedCustomer.assignedSales}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">登録日</span>
                        <span className="info-value">{selectedCustomer.createdDate}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">最終コンタクト</span>
                        <span className="info-value">{selectedCustomer.lastContact}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedCustomer.notes && (
                  <div className="notes-section">
                    <h4>📝 備考・特記事項</h4>
                    <div className="notes-content">
                      <p>{selectedCustomer.notes}</p>
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
                        {communications.filter(comm => comm.customerId === selectedCustomer.id).length}件
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">最終コンタクト</span>
                      <span className="summary-value">{selectedCustomer.lastContact}</span>
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
                    .filter(comm => comm.customerId === selectedCustomer.id)
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

                  {communications.filter(comm => comm.customerId === selectedCustomer.id).length === 0 && (
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
        ) : activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="dashboard-header">
              <h2>📊 CRMダッシュボード</h2>
              <p>営業活動の全体像を把握できます</p>
            </div>

            {analytics && (
              <div className="dashboard-layout">
                {/* チーム全体情報セクション */}
                <div className="team-overview-section">
                  <div className="section-header">
                    <h3>🏢 チーム全体の状況</h3>
                    <p>今月の目標達成状況と営業チーム全体の実績</p>
                  </div>

                  {/* 今月の目標・実績 */}
                  <div className="team-kpi-cards">
                    <div className="team-kpi-card primary">
                      <div className="kpi-header">
                        <h4>📈 今月の売上目標</h4>
                        <span className="kpi-period">2024年3月</span>
                      </div>
                      <div className="kpi-main">
                        <div className="kpi-value">¥{analytics.salesForecast.currentMonth.target.toLocaleString()}</div>
                        <div className="kpi-achieved">実績: ¥{analytics.salesForecast.currentMonth.achieved.toLocaleString()}</div>
                      </div>
                      <div className="kpi-progress">
                        <div className="progress-bar large">
                          <div className="progress-fill" style={{width: `${analytics.salesForecast.currentMonth.progress}%`}}></div>
                        </div>
                        <div className="progress-info">
                          <span className="progress-percentage">{analytics.salesForecast.currentMonth.progress}% 達成</span>
                          <span className="progress-remaining">残り: ¥{analytics.salesForecast.currentMonth.remaining.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="team-kpi-card">
                      <h4>🎯 パイプライン総額</h4>
                      <div className="kpi-value">¥{analytics.pipelineAnalysis.totalValue.toLocaleString()}</div>
                      <div className="kpi-sub">加重値: ¥{analytics.pipelineAnalysis.weightedValue.toLocaleString()}</div>
                      <div className="kpi-sub">平均案件サイズ: ¥{analytics.pipelineAnalysis.averageDealSize.toLocaleString()}</div>
                    </div>

                    <div className="team-kpi-card">
                      <h4>👥 顧客・活動状況</h4>
                      <div className="kpi-grid">
                        <div className="kpi-item">
                          <span className="kpi-label">アクティブ顧客</span>
                          <span className="kpi-number">{analytics.customerAnalysis.activeCustomers}</span>
                        </div>
                        <div className="kpi-item">
                          <span className="kpi-label">今月新規</span>
                          <span className="kpi-number">{analytics.customerAnalysis.newCustomersThisMonth}</span>
                        </div>
                        <div className="kpi-item">
                          <span className="kpi-label">総顧客数</span>
                          <span className="kpi-number">{analytics.customerAnalysis.totalCustomers}</span>
                        </div>
                        <div className="kpi-item">
                          <span className="kpi-label">継続率</span>
                          <span className="kpi-number">{analytics.customerAnalysis.customerRetentionRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 営業チーム実績 */}
                  <div className="team-performance-section">
                    <h4>👥 営業チーム実績ランキング</h4>
                    <div className="team-performance-grid">
                      {analytics.salesPerformance.salesTeam
                        .sort((a, b) => b.progress - a.progress)
                        .map((member, index) => (
                          <div key={index} className={`team-member-card ${index === 0 ? 'top-performer' : ''}`}>
                            <div className="member-rank">
                              {index === 0 && '🏆'}
                              {index === 1 && '🥈'}
                              {index === 2 && '🥉'}
                              {index > 2 && `${index + 1}位`}
                            </div>
                            <div className="member-info">
                              <h5>{member.name}</h5>
                              <div className="member-stats">
                                <div className="stat-row">
                                  <span>目標: ¥{member.target.toLocaleString()}</span>
                                  <span className="achievement-rate">{member.progress}%</span>
                                </div>
                                <div className="stat-row">
                                  <span>実績: ¥{member.achieved.toLocaleString()}</span>
                                  <span>{member.deals}件</span>
                                </div>
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
                </div>

                {/* 個別情報セクション */}
                <div className="individual-section">
                  <div className="section-header">
                    <h3>👤 個人の活動状況</h3>
                    <p>あなたの目標達成状況と最近の活動履歴</p>
                  </div>

                  <div className="individual-content">
                    {/* 個人目標・実績 */}
                    <div className="individual-performance">
                      <h4>📊 あなたの実績 - 佐藤 花子</h4>
                      <div className="individual-kpi-cards">
                        <div className="individual-kpi-card">
                          <h5>今月の目標</h5>
                          <div className="kpi-value">¥8,000,000</div>
                          <div className="kpi-progress">
                            <div className="progress-bar">
                              <div className="progress-fill" style={{width: '75%'}}></div>
                            </div>
                            <span>75% 達成 (¥6,000,000)</span>
                          </div>
                        </div>
                        
                        <div className="individual-kpi-card">
                          <h5>今月の案件数</h5>
                          <div className="kpi-value">12件</div>
                          <div className="kpi-sub">目標: 15件 (80%達成)</div>
                        </div>
                        
                        <div className="individual-kpi-card">
                          <h5>平均案件サイズ</h5>
                          <div className="kpi-value">¥500,000</div>
                          <div className="kpi-sub">前月比: +15%</div>
                        </div>
                      </div>
                    </div>

                    {/* 直近の活動履歴 */}
                    <div className="recent-activities">
                      <h4>📝 直近の活動履歴</h4>
                      <div className="activity-timeline">
                        {communications.slice(0, 8).map((comm, index) => (
                          <div key={index} className="activity-timeline-item">
                            <div className="activity-time">
                              <span className="activity-date">{comm.date}</span>
                              <span className="activity-hour">{comm.time}</span>
                            </div>
                            <div className="activity-icon">
                              {comm.type === '電話' && '📞'}
                              {comm.type === 'メール' && '📧'}
                              {comm.type === '会議' && '🤝'}
                              {comm.type === '訪問' && '🏢'}
                            </div>
                            <div className="activity-content">
                              <h6>{comm.subject}</h6>
                              <p>{comm.customerName}</p>
                              <div className="activity-meta">
                                <span className={`priority-badge priority-${comm.priority}`}>
                                  {comm.priority}
                                </span>
                                {comm.nextAction && (
                                  <span className="next-action">次: {comm.nextAction}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 今日のタスク */}
                    <div className="today-tasks">
                      <h4>✅ 今日のタスク</h4>
                      <div className="task-list">
                        {tasks.filter(t => t.status !== '完了').slice(0, 5).map((task, index) => (
                          <div key={index} className="task-item">
                            <div className="task-priority">
                              <span className={`priority-dot priority-${task.priority}`}></span>
                            </div>
                            <div className="task-content">
                              <h6>{task.title}</h6>
                              <p>{task.customerName && `${task.customerName} - `}{task.description}</p>
                              <div className="task-meta">
                                <span className="task-due">期限: {task.dueDate}</span>
                                <span className={`task-status status-${task.status}`}>{task.status}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
                        <button className="btn-small" onClick={() => handleViewCustomerDetail(customer)}>詳細</button>
                        <button className="btn-small" onClick={() => handleEditCustomer(customer)}>編集</button>
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

        {activeTab === 'calendar' && (
          <div className="sales-calendar">
            <div className="section-header">
              <h2>📅 営業カレンダー</h2>
              <button className="btn-primary" onClick={() => setShowCalendarModal(true)}>+ 予定追加</button>
            </div>

            <div className="calendar-controls">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <select className="filter-select">
                <option>全ての営業担当</option>
                <option>佐藤 花子</option>
                <option>鈴木 一郎</option>
                <option>田村 正樹</option>
              </select>
              <select className="filter-select">
                <option>全ての種類</option>
                <option>訪問</option>
                <option>会議</option>
                <option>電話</option>
                <option>デモ</option>
                <option>その他</option>
              </select>
            </div>

            <div className="calendar-view">
              <div className="calendar-month">
                <div className="month-header">
                  <button 
                    className="month-nav-btn" 
                    onClick={() => {
                      const date = new Date(selectedDate);
                      date.setMonth(date.getMonth() - 1);
                      setSelectedDate(date.toISOString().split('T')[0]);
                    }}
                  >
                    ←
                  </button>
                  <h3>
                    {new Date(selectedDate).toLocaleDateString('ja-JP', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </h3>
                  <button 
                    className="month-nav-btn"
                    onClick={() => {
                      const date = new Date(selectedDate);
                      date.setMonth(date.getMonth() + 1);
                      setSelectedDate(date.toISOString().split('T')[0]);
                    }}
                  >
                    →
                  </button>
                </div>
                
                <div className="calendar-grid">
                  <div className="weekdays-header">
                    {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                      <div key={index} className="weekday-header">{day}</div>
                    ))}
                  </div>
                  
                  <div className="calendar-days">
                    {(() => {
                      const currentDate = new Date(selectedDate);
                      const year = currentDate.getFullYear();
                      const month = currentDate.getMonth();
                      
                      // 月の最初の日
                      const firstDay = new Date(year, month, 1);
                      // 月の最後の日
                      const lastDay = new Date(year, month + 1, 0);
                      
                      // カレンダーグリッドの開始日（前月の日曜日から）
                      const startDate = new Date(firstDay);
                      startDate.setDate(firstDay.getDate() - firstDay.getDay());
                      
                      // カレンダーグリッドの終了日（翌月の土曜日まで）
                      const endDate = new Date(lastDay);
                      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
                      
                      const days = [];
                      const currentDay = new Date(startDate);
                      
                      while (currentDay <= endDate) {
                        days.push(new Date(currentDay));
                        currentDay.setDate(currentDay.getDate() + 1);
                      }

                      return days.map((day, index) => {
                        const dayStr = day.toISOString().split('T')[0];
                        const dayEvents = calendarEvents.filter(event => event.date === dayStr);
                        const isToday = dayStr === new Date().toISOString().split('T')[0];
                        const isCurrentMonth = day.getMonth() === month;
                        const isSelected = dayStr === selectedDate;

                        return (
                          <div 
                            key={index} 
                            className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                            onClick={() => setSelectedDate(dayStr)}
                          >
                            <div className="day-number">{day.getDate()}</div>
                            <div className="day-tasks">
                              {dayEvents.map((event) => (
                                <div key={event.id} className={`task-item event-${event.type} status-${event.status}`}>
                                  <div className="task-time">{event.startTime}</div>
                                  <div className="task-sales">{event.assignedSales}</div>
                                  <div className="task-destination">
                                    {event.customerName ? `→ ${event.customerName}` : event.title}
                                  </div>
                                  <div className="task-type">
                                    {event.type === 'visit' ? '🏢' : 
                                     event.type === 'meeting' ? '🤝' : 
                                     event.type === 'call' ? '📞' : 
                                     event.type === 'demo' ? '💻' : '📋'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="calendar-summary">
              <h3>今週の予定サマリー</h3>
              <div className="summary-stats">
                <div className="stat-item">
                  <div className="stat-label">総予定数</div>
                  <div className="stat-value">{calendarEvents.length}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">顧客訪問</div>
                  <div className="stat-value">{calendarEvents.filter(e => e.type === 'visit').length}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">会議</div>
                  <div className="stat-value">{calendarEvents.filter(e => e.type === 'meeting').length}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">デモ</div>
                  <div className="stat-value">{calendarEvents.filter(e => e.type === 'demo').length}</div>
                </div>
              </div>
            </div>

            <div className="upcoming-events">
              <h3>今後の予定</h3>
              <div className="events-list">
                {calendarEvents
                  .filter(event => event.date >= new Date().toISOString().split('T')[0])
                  .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className={`upcoming-event event-${event.type}`}>
                      <div className="event-datetime">
                        <div className="event-date">{event.date}</div>
                        <div className="event-time">{event.startTime} - {event.endTime}</div>
                      </div>
                      <div className="event-details">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                        <div className="event-meta">
                          <span className="event-type-badge">{
                            event.type === 'visit' ? '🏢 訪問' :
                            event.type === 'meeting' ? '🤝 会議' :
                            event.type === 'call' ? '📞 電話' :
                            event.type === 'demo' ? '💻 デモ' : '📋 その他'
                          }</span>
                          <span className="event-sales">👤 {event.assignedSales}</span>
                          {event.customerName && <span className="event-customer">🏢 {event.customerName}</span>}
                        </div>
                        {event.location && <div className="event-location">📍 {event.location}</div>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 新規顧客追加モーダル */}
      {showCustomerModal && (
        <div className="modal-overlay" onClick={() => {
          setShowCustomerModal(false);
          setEditingCustomer(null);
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
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCustomer ? '顧客情報編集' : '新規顧客追加'}</h3>
              <button className="modal-close" onClick={() => {
                setShowCustomerModal(false);
                setEditingCustomer(null);
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
              }}>×</button>
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
              <button className="btn-secondary" onClick={() => {
                setShowCustomerModal(false);
                setEditingCustomer(null);
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
              }}>
                キャンセル
              </button>
              <button className="btn-primary" onClick={handleAddCustomer}>
                {editingCustomer ? '顧客を更新' : '顧客を追加'}
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

      {/* 新規カレンダーイベント追加モーダル */}
      {showCalendarModal && (
        <div className="modal-overlay" onClick={() => setShowCalendarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>新規予定追加</h3>
              <button className="modal-close" onClick={() => setShowCalendarModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>予定名 <span className="required">*</span></label>
                  <input
                    type="text"
                    value={newCalendarEvent.title || ''}
                    onChange={(e) => handleCalendarInputChange('title', e.target.value)}
                    placeholder="顧客訪問・会議・デモ等"
                  />
                </div>
                
                <div className="form-group">
                  <label>種類</label>
                  <select
                    value={newCalendarEvent.type || 'visit'}
                    onChange={(e) => handleCalendarInputChange('type', e.target.value)}
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
                    value={newCalendarEvent.date || selectedDate}
                    onChange={(e) => handleCalendarInputChange('date', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>開始時間</label>
                  <input
                    type="time"
                    value={newCalendarEvent.startTime || '09:00'}
                    onChange={(e) => handleCalendarInputChange('startTime', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>終了時間</label>
                  <input
                    type="time"
                    value={newCalendarEvent.endTime || '10:00'}
                    onChange={(e) => handleCalendarInputChange('endTime', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>担当営業 <span className="required">*</span></label>
                  <select
                    value={newCalendarEvent.assignedSales || ''}
                    onChange={(e) => handleCalendarInputChange('assignedSales', e.target.value)}
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
                    value={newCalendarEvent.customerId || 0}
                    onChange={(e) => handleCalendarInputChange('customerId', parseInt(e.target.value) || null)}
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
                    value={newCalendarEvent.customerName || ''}
                    onChange={(e) => handleCalendarInputChange('customerName', e.target.value)}
                    placeholder="新規顧客名など"
                    disabled={!!newCalendarEvent.customerId}
                  />
                </div>
                
                <div className="form-group">
                  <label>場所・住所</label>
                  <input
                    type="text"
                    value={newCalendarEvent.location || ''}
                    onChange={(e) => handleCalendarInputChange('location', e.target.value)}
                    placeholder="東京都渋谷区... / オンライン / 電話会議"
                  />
                </div>
                
                <div className="form-group">
                  <label>関連案件</label>
                  <select
                    value={newCalendarEvent.relatedOpportunityId || 0}
                    onChange={(e) => handleCalendarInputChange('relatedOpportunityId', parseInt(e.target.value) || null)}
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
                    value={newCalendarEvent.status || 'scheduled'}
                    onChange={(e) => handleCalendarInputChange('status', e.target.value)}
                  >
                    <option value="scheduled">予定</option>
                    <option value="completed">完了</option>
                    <option value="cancelled">キャンセル</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>詳細・説明</label>
                  <textarea
                    value={newCalendarEvent.description || ''}
                    onChange={(e) => handleCalendarInputChange('description', e.target.value)}
                    placeholder="会議の目的、議題、準備事項など..."
                    rows={2}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>備考・メモ</label>
                  <textarea
                    value={newCalendarEvent.notes || ''}
                    onChange={(e) => handleCalendarInputChange('notes', e.target.value)}
                    placeholder="参加者、持参物、注意事項など..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCalendarModal(false)}>
                キャンセル
              </button>
              <button className="btn-primary" onClick={handleAddCalendarEvent}>
                予定を追加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 顧客詳細モーダル */}
      {showCustomerDetail && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowCustomerDetail(false)}>
          <div className="modal-content customer-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>顧客詳細情報</h3>
              <button className="modal-close" onClick={() => setShowCustomerDetail(false)}>×</button>
            </div>
            
            <div className="modal-body customer-detail-body">
              {/* 顧客基礎情報セクション */}
              <div className="customer-info-section">
                <h4>📋 基礎情報</h4>
                <div className="customer-info-grid">
                  <div className="info-card">
                    <div className="info-header">
                      <h5>{selectedCustomer.companyName}</h5>
                      <span className={`status-badge status-${selectedCustomer.status.replace(/\s+/g, '-')}`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                    <div className="info-details">
                      <div className="info-row">
                        <span className="info-label">担当者:</span>
                        <span className="info-value">{selectedCustomer.contactName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">役職:</span>
                        <span className="info-value">{selectedCustomer.position}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">メール:</span>
                        <span className="info-value">{selectedCustomer.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">電話:</span>
                        <span className="info-value">{selectedCustomer.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-card">
                    <h6>🏢 企業情報</h6>
                    <div className="info-details">
                      <div className="info-row">
                        <span className="info-label">業界:</span>
                        <span className="info-value">{selectedCustomer.industry}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">企業規模:</span>
                        <span className="info-value">{selectedCustomer.companySize}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">年間売上:</span>
                        <span className="info-value">¥{selectedCustomer.revenue.toLocaleString()}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">住所:</span>
                        <span className="info-value">{selectedCustomer.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-card">
                    <h6>👤 営業情報</h6>
                    <div className="info-details">
                      <div className="info-row">
                        <span className="info-label">担当営業:</span>
                        <span className="info-value">{selectedCustomer.assignedSales}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">登録日:</span>
                        <span className="info-value">{selectedCustomer.createdDate}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">最終コンタクト:</span>
                        <span className="info-value">{selectedCustomer.lastContact}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedCustomer.notes && (
                  <div className="customer-notes">
                    <h6>📝 備考</h6>
                    <p>{selectedCustomer.notes}</p>
                  </div>
                )}
              </div>

              {/* 取引履歴セクション */}
              <div className="transaction-history-section">
                <h4>📊 取引履歴・コミュニケーション履歴</h4>
                <div className="history-filters">
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
                </div>
                
                <div className="history-timeline">
                  {communications
                    .filter(comm => comm.customerId === selectedCustomer.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((comm) => (
                      <div key={comm.id} className="timeline-item">
                        <div className="timeline-icon">
                          {comm.type === '電話' && '📞'}
                          {comm.type === 'メール' && '📧'}
                          {comm.type === '会議' && '🤝'}
                          {comm.type === '訪問' && '🏢'}
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <h6>{comm.subject}</h6>
                            <div className="timeline-meta">
                              <span className="timeline-date">{comm.date} {comm.time}</span>
                              <span className={`priority-badge priority-${comm.priority}`}>
                                {comm.priority}
                              </span>
                            </div>
                          </div>
                          <p className="timeline-summary">{comm.summary}</p>
                          {comm.participants.length > 0 && (
                            <div className="timeline-participants">
                              <strong>参加者:</strong> {comm.participants.join(', ')}
                            </div>
                          )}
                          {comm.nextAction && (
                            <div className="timeline-next-action">
                              <strong>次のアクション:</strong> {comm.nextAction}
                            </div>
                          )}
                          {comm.duration && (
                            <div className="timeline-duration">
                              <strong>時間:</strong> {comm.duration}分
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  
                  {communications.filter(comm => comm.customerId === selectedCustomer.id).length === 0 && (
                    <div className="no-history">
                      <p>まだコミュニケーション履歴がありません。</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCustomerDetail(false)}>
                閉じる
              </button>
              <button className="btn-primary" onClick={() => {
                setShowCustomerDetail(false);
                handleEditCustomer(selectedCustomer);
              }}>
                編集する
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
