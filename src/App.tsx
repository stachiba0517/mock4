import React, { useState, useEffect } from 'react';
import './App.css';

// Types
import { 
  Customer, 
  SalesOpportunity, 
  Communication, 
  Task, 
  CalendarEvent, 
  Analytics
} from './types';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Dashboard from './components/pages/Dashboard';
import CustomerManagement from './components/pages/CustomerManagement';
import CustomerDetail from './components/pages/CustomerDetail';
import SalesOpportunities from './components/pages/SalesOpportunities';
import SalesCalendar from './components/pages/SalesCalendar';
import SalesReport from './components/pages/SalesReport';
import SimplePage from './components/pages/SimplePage';

// Modals
import CustomerModal from './components/modals/CustomerModal';
import OpportunityModal from './components/modals/OpportunityModal';
import CalendarModal from './components/modals/CalendarModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  // Customer management states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetailPage, setShowCustomerDetailPage] = useState(false);
  
  // Form states
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

    handleCloseCustomerModal();
  };

  // 顧客入力値更新ハンドラー
  const handleCustomerInputChange = (field: keyof Customer, value: string | number) => {
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

  // 顧客詳細表示ハンドラー
  const handleViewCustomerDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetailPage(true);
  };

  // 顧客詳細ページから戻る
  const handleBackToCustomers = () => {
    setShowCustomerDetailPage(false);
    setSelectedCustomer(null);
  };

  // 顧客モーダルを閉じる
  const handleCloseCustomerModal = () => {
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
    handleCloseOpportunityModal();
  };

  // 営業案件入力値更新ハンドラー
  const handleOpportunityInputChange = (field: keyof SalesOpportunity, value: string | number | string[]) => {
    setNewOpportunity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 営業案件モーダルを閉じる
  const handleCloseOpportunityModal = () => {
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
    handleCloseCalendarModal();
  };

  // カレンダーイベント入力値更新ハンドラー
  const handleCalendarInputChange = (field: keyof CalendarEvent, value: string | number | null) => {
    setNewCalendarEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // カレンダーモーダルを閉じる
  const handleCloseCalendarModal = () => {
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
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        {showCustomerDetailPage && selectedCustomer ? (
          <CustomerDetail
            customer={selectedCustomer}
            communications={communications}
            onBack={handleBackToCustomers}
            onEdit={(customer) => {
              setShowCustomerDetailPage(false);
              handleEditCustomer(customer);
            }}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                analytics={analytics}
                communications={communications}
                tasks={tasks}
                calendarEvents={calendarEvents}
              />
            )}

            {activeTab === 'customers' && (
              <CustomerManagement
                customers={customers}
                onAddCustomer={() => setShowCustomerModal(true)}
                onEditCustomer={handleEditCustomer}
                onViewCustomerDetail={handleViewCustomerDetail}
              />
            )}

            {activeTab === 'opportunities' && (
              <SalesOpportunities
                opportunities={opportunities}
                analytics={analytics}
                onAddOpportunity={() => setShowOpportunityModal(true)}
              />
            )}

            {activeTab === 'calendar' && (
              <SalesCalendar
                calendarEvents={calendarEvents}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onAddEvent={() => setShowCalendarModal(true)}
              />
            )}

            {activeTab === 'communications' && (
              <SimplePage
                title="💬 コミュニケーション履歴管理"
                description="顧客との全ての接触履歴を時系列で管理します。"
                features={[
                  '電話、メール、会議、訪問の記録',
                  '時系列での履歴表示',
                  '次のアクション設定',
                  '優先度管理'
                ]}
              />
            )}

            {activeTab === 'tasks' && (
              <SimplePage
                title="📅 タスク・スケジュール管理"
                description="営業活動に関するタスクを効率的に管理します。"
                features={[
                  'フォローアップタスク管理',
                  'アポイントメント管理',
                  '締切管理',
                  '優先度別表示'
                ]}
              />
            )}

            {activeTab === 'analytics' && (
              <SimplePage
                title="📈 売上予測・分析機能"
                description="過去のデータから売上予測を立て、営業実績を分析します。"
                features={[
                  '売上予測レポート',
                  '営業実績分析',
                  'KPI管理',
                  'トレンド分析'
                ]}
              />
            )}

            {activeTab === 'marketing' && (
              <SimplePage
                title="🚀 マーケティングオートメーション"
                description="メール配信、キャンペーン管理、リードナーチャリングを自動化します。"
                features={[
                  'メールキャンペーン管理',
                  'リードナーチャリング',
                  'スコアリング機能',
                  '自動化ワークフロー'
                ]}
              />
            )}

            {activeTab === 'documents' && (
              <SalesReport
                customers={customers}
                opportunities={opportunities}
              />
            )}

            {activeTab === 'reports' && (
              <SimplePage
                title="📊 レポート・ダッシュボード"
                description="営業実績、顧客分析、活動状況を視覚的に表示します。"
                features={[
                  '営業実績レポート',
                  '顧客分析ダッシュボード',
                  '活動状況レポート',
                  'カスタムレポート作成'
                ]}
              />
            )}
          </>
        )}
      </main>

      {/* モーダル */}
      <CustomerModal
        isOpen={showCustomerModal}
        customer={newCustomer}
        editingCustomer={editingCustomer}
        onClose={handleCloseCustomerModal}
        onSave={handleAddCustomer}
        onInputChange={handleCustomerInputChange}
      />

      <OpportunityModal
        isOpen={showOpportunityModal}
        opportunity={newOpportunity}
        customers={customers}
        onClose={handleCloseOpportunityModal}
        onSave={handleAddOpportunity}
        onInputChange={handleOpportunityInputChange}
      />

      <CalendarModal
        isOpen={showCalendarModal}
        event={newCalendarEvent}
        customers={customers}
        opportunities={opportunities}
        onClose={handleCloseCalendarModal}
        onSave={handleAddCalendarEvent}
        onInputChange={handleCalendarInputChange}
      />

      <Footer />
    </div>
  );
};

export default App;
