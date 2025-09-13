import React, { useState, useEffect } from 'react';
import { DailyReport, Customer, SalesOpportunity } from '../../types';

interface SalesReportProps {
  customers: Customer[];
  opportunities: SalesOpportunity[];
}

const SalesReport: React.FC<SalesReportProps> = ({ customers, opportunities }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentReport, setCurrentReport] = useState<DailyReport | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reports, setReports] = useState<DailyReport[]>([]);

  // 新しい活動を追加するための状態
  const [newActivity, setNewActivity] = useState({
    type: 'visit' as const,
    customerId: null as number | null,
    customerName: '',
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    result: '',
    nextAction: '',
    priority: '中' as const
  });

  // 日報の初期データ
  const initializeReport = (date: string): DailyReport => ({
    id: Date.now(),
    date,
    salesPerson: '佐藤 花子', // 現在のユーザー名
    workingHours: {
      start: '09:00',
      end: '18:00',
      break: 60
    },
    activities: [],
    achievements: {
      newLeads: 0,
      meetings: 0,
      proposals: 0,
      contracts: 0,
      revenue: 0
    },
    challenges: '',
    tomorrowPlan: '',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // 日付変更時の処理
  useEffect(() => {
    const existingReport = reports.find(r => r.date === selectedDate);
    if (existingReport) {
      setCurrentReport(existingReport);
    } else {
      setCurrentReport(initializeReport(selectedDate));
    }
    setIsEditing(false);
  }, [selectedDate, reports]);

  // 活動を追加
  const handleAddActivity = () => {
    if (!currentReport) return;

    const activity = {
      id: Date.now(),
      ...newActivity,
      customerName: newActivity.customerId ? 
        customers.find(c => c.id === newActivity.customerId)?.companyName || newActivity.customerName :
        newActivity.customerName
    };

    const updatedReport = {
      ...currentReport,
      activities: [...currentReport.activities, activity],
      updatedAt: new Date().toISOString()
    };

    setCurrentReport(updatedReport);
    updateReports(updatedReport);

    // フォームをリセット
    setNewActivity({
      type: 'visit',
      customerId: null,
      customerName: '',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      result: '',
      nextAction: '',
      priority: '中'
    });
  };

  // 活動を削除
  const handleDeleteActivity = (activityId: number) => {
    if (!currentReport) return;

    const updatedReport = {
      ...currentReport,
      activities: currentReport.activities.filter(a => a.id !== activityId),
      updatedAt: new Date().toISOString()
    };

    setCurrentReport(updatedReport);
    updateReports(updatedReport);
  };

  // 日報を更新
  const updateReports = (report: DailyReport) => {
    setReports(prev => {
      const index = prev.findIndex(r => r.date === report.date);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = report;
        return updated;
      } else {
        return [...prev, report];
      }
    });
  };

  // 日報を保存
  const handleSaveReport = () => {
    if (!currentReport) return;

    const updatedReport = {
      ...currentReport,
      updatedAt: new Date().toISOString()
    };

    updateReports(updatedReport);
    setIsEditing(false);
    alert('日報を保存しました');
  };

  // 実績を自動計算
  const calculateAchievements = () => {
    if (!currentReport) return;

    const achievements = {
      newLeads: currentReport.activities.filter(a => a.type === 'call' || a.type === 'email').length,
      meetings: currentReport.activities.filter(a => a.type === 'meeting' || a.type === 'visit').length,
      proposals: currentReport.activities.filter(a => a.type === 'proposal').length,
      contracts: 0, // 手動入力
      revenue: 0 // 手動入力
    };

    const updatedReport = {
      ...currentReport,
      achievements,
      updatedAt: new Date().toISOString()
    };

    setCurrentReport(updatedReport);
  };

  // 活動時間の合計を計算
  const calculateTotalWorkTime = () => {
    if (!currentReport) return 0;
    
    return currentReport.activities.reduce((total, activity) => {
      const start = new Date(`2000-01-01T${activity.startTime}`);
      const end = new Date(`2000-01-01T${activity.endTime}`);
      return total + (end.getTime() - start.getTime()) / (1000 * 60); // 分単位
    }, 0);
  };

  if (!currentReport) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sales-report">
      <div className="sales-report-header">
        <div className="header-top">
          <h2>📝 営業日報</h2>
          <div className="header-actions">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker"
            />
            <button 
              className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '表示モード' : '編集モード'}
            </button>
            {isEditing && (
              <button className="btn btn-success" onClick={handleSaveReport}>
                保存
              </button>
            )}
          </div>
        </div>
        
        <div className="report-summary">
          <div className="summary-card">
            <span className="summary-label">営業担当</span>
            <span className="summary-value">{currentReport.salesPerson}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">活動時間</span>
            <span className="summary-value">{Math.floor(calculateTotalWorkTime() / 60)}時間{calculateTotalWorkTime() % 60}分</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">活動件数</span>
            <span className="summary-value">{currentReport.activities.length}件</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">最終更新</span>
            <span className="summary-value">
              {new Date(currentReport.updatedAt).toLocaleString('ja-JP')}
            </span>
          </div>
        </div>
      </div>

      <div className="report-content">
        {/* 勤務時間 */}
        <div className="report-section">
          <h3>⏰ 勤務時間</h3>
          <div className="working-hours">
            <div className="time-input-group">
              <label>開始時刻</label>
              <input
                type="time"
                value={currentReport.workingHours.start}
                onChange={(e) => isEditing && setCurrentReport({
                  ...currentReport,
                  workingHours: { ...currentReport.workingHours, start: e.target.value }
                })}
                disabled={!isEditing}
                className="time-input"
              />
            </div>
            <div className="time-input-group">
              <label>終了時刻</label>
              <input
                type="time"
                value={currentReport.workingHours.end}
                onChange={(e) => isEditing && setCurrentReport({
                  ...currentReport,
                  workingHours: { ...currentReport.workingHours, end: e.target.value }
                })}
                disabled={!isEditing}
                className="time-input"
              />
            </div>
            <div className="time-input-group">
              <label>休憩時間（分）</label>
              <input
                type="number"
                value={currentReport.workingHours.break}
                onChange={(e) => isEditing && setCurrentReport({
                  ...currentReport,
                  workingHours: { ...currentReport.workingHours, break: parseInt(e.target.value) || 0 }
                })}
                disabled={!isEditing}
                className="number-input"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* 活動記録 */}
        <div className="report-section">
          <div className="section-header">
            <h3>📋 活動記録</h3>
            {isEditing && (
              <button className="btn btn-primary" onClick={calculateAchievements}>
                実績を自動計算
              </button>
            )}
          </div>

          {/* 活動追加フォーム */}
          {isEditing && (
            <div className="activity-form">
              <h4>新しい活動を追加</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>活動種別</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      type: e.target.value as any
                    })}
                    className="form-select"
                  >
                    <option value="visit">訪問</option>
                    <option value="call">電話</option>
                    <option value="email">メール</option>
                    <option value="meeting">会議</option>
                    <option value="proposal">提案</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>顧客</label>
                  <select
                    value={newActivity.customerId || ''}
                    onChange={(e) => {
                      const customerId = e.target.value ? parseInt(e.target.value) : null;
                      setNewActivity({
                        ...newActivity,
                        customerId,
                        customerName: customerId ? 
                          customers.find(c => c.id === customerId)?.companyName || '' : 
                          newActivity.customerName
                      });
                    }}
                    className="form-select"
                  >
                    <option value="">顧客を選択</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.companyName}
                      </option>
                    ))}
                  </select>
                  {!newActivity.customerId && (
                    <input
                      type="text"
                      placeholder="または顧客名を入力"
                      value={newActivity.customerName}
                      onChange={(e) => setNewActivity({
                        ...newActivity,
                        customerName: e.target.value
                      })}
                      className="form-input"
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>開始時刻</label>
                  <input
                    type="time"
                    value={newActivity.startTime}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      startTime: e.target.value
                    })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>終了時刻</label>
                  <input
                    type="time"
                    value={newActivity.endTime}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      endTime: e.target.value
                    })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>優先度</label>
                  <select
                    value={newActivity.priority}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      priority: e.target.value as any
                    })}
                    className="form-select"
                  >
                    <option value="高">高</option>
                    <option value="中">中</option>
                    <option value="低">低</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>活動内容</label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      description: e.target.value
                    })}
                    className="form-textarea"
                    rows={2}
                    placeholder="活動の詳細を入力してください"
                  />
                </div>

                <div className="form-group full-width">
                  <label>結果・成果</label>
                  <textarea
                    value={newActivity.result}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      result: e.target.value
                    })}
                    className="form-textarea"
                    rows={2}
                    placeholder="活動の結果や成果を入力してください"
                  />
                </div>

                <div className="form-group full-width">
                  <label>次のアクション</label>
                  <textarea
                    value={newActivity.nextAction}
                    onChange={(e) => setNewActivity({
                      ...newActivity,
                      nextAction: e.target.value
                    })}
                    className="form-textarea"
                    rows={2}
                    placeholder="次に取るべきアクションを入力してください"
                  />
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleAddActivity}>
                活動を追加
              </button>
            </div>
          )}

          {/* 活動一覧 */}
          <div className="activities-list">
            {currentReport.activities.length === 0 ? (
              <div className="no-activities">
                <p>まだ活動が記録されていません</p>
              </div>
            ) : (
              currentReport.activities
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((activity, index) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-header">
                      <div className="activity-time">
                        <span className="time-range">
                          {activity.startTime} - {activity.endTime}
                        </span>
                        <span className={`activity-type type-${activity.type}`}>
                          {activity.type === 'visit' ? '🏢 訪問' :
                           activity.type === 'call' ? '📞 電話' :
                           activity.type === 'email' ? '📧 メール' :
                           activity.type === 'meeting' ? '🤝 会議' :
                           activity.type === 'proposal' ? '📋 提案' : '📝 その他'}
                        </span>
                        <span className={`priority-badge priority-${activity.priority}`}>
                          {activity.priority}
                        </span>
                      </div>
                      {isEditing && (
                        <button 
                          className="btn btn-danger btn-small"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          削除
                        </button>
                      )}
                    </div>

                    <div className="activity-content">
                      <div className="activity-customer">
                        <strong>{activity.customerName}</strong>
                      </div>
                      
                      <div className="activity-description">
                        <h5>活動内容</h5>
                        <p>{activity.description}</p>
                      </div>

                      {activity.result && (
                        <div className="activity-result">
                          <h5>結果・成果</h5>
                          <p>{activity.result}</p>
                        </div>
                      )}

                      {activity.nextAction && (
                        <div className="activity-next-action">
                          <h5>次のアクション</h5>
                          <p>{activity.nextAction}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* 実績サマリー */}
        <div className="report-section">
          <h3>📊 本日の実績</h3>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">📞</div>
              <div className="achievement-content">
                <span className="achievement-label">新規リード</span>
                <div className="achievement-value">
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentReport.achievements.newLeads}
                      onChange={(e) => setCurrentReport({
                        ...currentReport,
                        achievements: {
                          ...currentReport.achievements,
                          newLeads: parseInt(e.target.value) || 0
                        }
                      })}
                      className="achievement-input"
                      min="0"
                    />
                  ) : (
                    <span>{currentReport.achievements.newLeads}</span>
                  )}
                  <span className="achievement-unit">件</span>
                </div>
              </div>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">🤝</div>
              <div className="achievement-content">
                <span className="achievement-label">商談・会議</span>
                <div className="achievement-value">
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentReport.achievements.meetings}
                      onChange={(e) => setCurrentReport({
                        ...currentReport,
                        achievements: {
                          ...currentReport.achievements,
                          meetings: parseInt(e.target.value) || 0
                        }
                      })}
                      className="achievement-input"
                      min="0"
                    />
                  ) : (
                    <span>{currentReport.achievements.meetings}</span>
                  )}
                  <span className="achievement-unit">件</span>
                </div>
              </div>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">📋</div>
              <div className="achievement-content">
                <span className="achievement-label">提案書作成</span>
                <div className="achievement-value">
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentReport.achievements.proposals}
                      onChange={(e) => setCurrentReport({
                        ...currentReport,
                        achievements: {
                          ...currentReport.achievements,
                          proposals: parseInt(e.target.value) || 0
                        }
                      })}
                      className="achievement-input"
                      min="0"
                    />
                  ) : (
                    <span>{currentReport.achievements.proposals}</span>
                  )}
                  <span className="achievement-unit">件</span>
                </div>
              </div>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">✅</div>
              <div className="achievement-content">
                <span className="achievement-label">成約</span>
                <div className="achievement-value">
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentReport.achievements.contracts}
                      onChange={(e) => setCurrentReport({
                        ...currentReport,
                        achievements: {
                          ...currentReport.achievements,
                          contracts: parseInt(e.target.value) || 0
                        }
                      })}
                      className="achievement-input"
                      min="0"
                    />
                  ) : (
                    <span>{currentReport.achievements.contracts}</span>
                  )}
                  <span className="achievement-unit">件</span>
                </div>
              </div>
            </div>

            <div className="achievement-card revenue">
              <div className="achievement-icon">💰</div>
              <div className="achievement-content">
                <span className="achievement-label">売上金額</span>
                <div className="achievement-value">
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentReport.achievements.revenue}
                      onChange={(e) => setCurrentReport({
                        ...currentReport,
                        achievements: {
                          ...currentReport.achievements,
                          revenue: parseInt(e.target.value) || 0
                        }
                      })}
                      className="achievement-input"
                      min="0"
                    />
                  ) : (
                    <span>¥{currentReport.achievements.revenue.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 課題・振り返り */}
        <div className="report-section">
          <h3>🤔 課題・振り返り</h3>
          <div className="reflection-content">
            {isEditing ? (
              <textarea
                value={currentReport.challenges}
                onChange={(e) => setCurrentReport({
                  ...currentReport,
                  challenges: e.target.value
                })}
                className="form-textarea large"
                rows={4}
                placeholder="今日の課題や改善点、学んだことを記入してください"
              />
            ) : (
              <div className="reflection-display">
                {currentReport.challenges || '課題・振り返りが記入されていません'}
              </div>
            )}
          </div>
        </div>

        {/* 明日の計画 */}
        <div className="report-section">
          <h3>📅 明日の計画</h3>
          <div className="plan-content">
            {isEditing ? (
              <textarea
                value={currentReport.tomorrowPlan}
                onChange={(e) => setCurrentReport({
                  ...currentReport,
                  tomorrowPlan: e.target.value
                })}
                className="form-textarea large"
                rows={4}
                placeholder="明日の予定や目標、重点的に取り組むことを記入してください"
              />
            ) : (
              <div className="plan-display">
                {currentReport.tomorrowPlan || '明日の計画が記入されていません'}
              </div>
            )}
          </div>
        </div>

        {/* 備考・その他 */}
        <div className="report-section">
          <h3>📝 備考・その他</h3>
          <div className="notes-content">
            {isEditing ? (
              <textarea
                value={currentReport.notes}
                onChange={(e) => setCurrentReport({
                  ...currentReport,
                  notes: e.target.value
                })}
                className="form-textarea large"
                rows={3}
                placeholder="その他の特記事項があれば記入してください"
              />
            ) : (
              <div className="notes-display">
                {currentReport.notes || '備考はありません'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
