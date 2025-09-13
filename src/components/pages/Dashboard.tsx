import React from 'react';
import { Analytics, Communication, Task, CalendarEvent } from '../../types';

interface DashboardProps {
  analytics: Analytics | null;
  communications: Communication[];
  tasks: Task[];
  calendarEvents: CalendarEvent[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  analytics, 
  communications, 
  tasks, 
  calendarEvents 
}) => {
  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 CRMダッシュボード</h2>
        <p>営業活動の全体像を把握できます</p>
      </div>

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
              
              {/* メイン KPI カード */}
              <div className="individual-kpi-cards">
                <div className="individual-kpi-card primary">
                  <h5>今月の売上目標</h5>
                  <div className="kpi-value">¥8,000,000</div>
                  <div className="kpi-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '75%'}}></div>
                    </div>
                    <span>75% 達成 (¥6,000,000)</span>
                  </div>
                  <div className="kpi-comparison">
                    <span className="comparison-item">前月: ¥5,200,000</span>
                    <span className="comparison-growth positive">+15.4%</span>
                  </div>
                </div>
                
                <div className="individual-kpi-card">
                  <h5>今月の案件数</h5>
                  <div className="kpi-value">12件</div>
                  <div className="kpi-sub">目標: 15件 (80%達成)</div>
                  <div className="kpi-breakdown">
                    <div className="breakdown-item">
                      <span>成約: 4件</span>
                      <span className="breakdown-value">¥3,200,000</span>
                    </div>
                    <div className="breakdown-item">
                      <span>商談中: 8件</span>
                      <span className="breakdown-value">¥4,800,000</span>
                    </div>
                  </div>
                </div>
                
                <div className="individual-kpi-card">
                  <h5>平均案件サイズ</h5>
                  <div className="kpi-value">¥500,000</div>
                  <div className="kpi-sub">前月比: +15%</div>
                  <div className="kpi-trend">
                    <div className="trend-chart">
                      <div className="trend-bar" style={{height: '60%'}}></div>
                      <div className="trend-bar" style={{height: '70%'}}></div>
                      <div className="trend-bar" style={{height: '85%'}}></div>
                      <div className="trend-bar" style={{height: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 詳細メトリクス */}
              <div className="detailed-metrics">
                <h5>📈 詳細パフォーマンス指標</h5>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <span className="metric-icon">📞</span>
                      <h6>コール活動</h6>
                    </div>
                    <div className="metric-stats">
                      <div className="stat-main">
                        <span className="stat-value">127</span>
                        <span className="stat-label">今月のコール数</span>
                      </div>
                      <div className="stat-details">
                        <div className="stat-item">
                          <span>成功率: 68%</span>
                          <span className="stat-trend positive">+5%</span>
                        </div>
                        <div className="stat-item">
                          <span>平均通話時間: 12分</span>
                        </div>
                        <div className="stat-item">
                          <span>アポ獲得: 23件</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <span className="metric-icon">📧</span>
                      <h6>メール活動</h6>
                    </div>
                    <div className="metric-stats">
                      <div className="stat-main">
                        <span className="stat-value">89</span>
                        <span className="stat-label">今月の送信数</span>
                      </div>
                      <div className="stat-details">
                        <div className="stat-item">
                          <span>開封率: 42%</span>
                          <span className="stat-trend positive">+8%</span>
                        </div>
                        <div className="stat-item">
                          <span>返信率: 18%</span>
                        </div>
                        <div className="stat-item">
                          <span>クリック率: 12%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <span className="metric-icon">🏢</span>
                      <h6>訪問・会議</h6>
                    </div>
                    <div className="metric-stats">
                      <div className="stat-main">
                        <span className="stat-value">34</span>
                        <span className="stat-label">今月の訪問数</span>
                      </div>
                      <div className="stat-details">
                        <div className="stat-item">
                          <span>新規訪問: 18件</span>
                        </div>
                        <div className="stat-item">
                          <span>フォロー訪問: 16件</span>
                        </div>
                        <div className="stat-item">
                          <span>平均滞在時間: 1.5時間</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <span className="metric-icon">🎯</span>
                      <h6>コンバージョン</h6>
                    </div>
                    <div className="metric-stats">
                      <div className="stat-main">
                        <span className="stat-value">28%</span>
                        <span className="stat-label">成約率</span>
                      </div>
                      <div className="stat-details">
                        <div className="stat-item">
                          <span>リード→商談: 45%</span>
                          <span className="stat-trend positive">+3%</span>
                        </div>
                        <div className="stat-item">
                          <span>商談→成約: 62%</span>
                        </div>
                        <div className="stat-item">
                          <span>平均営業サイクル: 45日</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 週次・月次比較 */}
              <div className="performance-comparison">
                <h5>📊 パフォーマンス推移</h5>
                <div className="comparison-tabs">
                  <button className="tab-btn active">週次</button>
                  <button className="tab-btn">月次</button>
                  <button className="tab-btn">四半期</button>
                </div>
                <div className="comparison-chart">
                  <div className="chart-header">
                    <span>売上実績推移（過去4週間）</span>
                  </div>
                  <div className="chart-bars">
                    <div className="chart-week">
                      <div className="week-bar" style={{height: '60%'}}></div>
                      <span className="week-label">第1週</span>
                      <span className="week-value">¥1,200,000</span>
                    </div>
                    <div className="chart-week">
                      <div className="week-bar" style={{height: '75%'}}></div>
                      <span className="week-label">第2週</span>
                      <span className="week-value">¥1,500,000</span>
                    </div>
                    <div className="chart-week">
                      <div className="week-bar" style={{height: '90%'}}></div>
                      <span className="week-label">第3週</span>
                      <span className="week-value">¥1,800,000</span>
                    </div>
                    <div className="chart-week current">
                      <div className="week-bar" style={{height: '100%'}}></div>
                      <span className="week-label">今週</span>
                      <span className="week-value">¥2,000,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 直近の活動履歴 */}
            <div className="recent-activities">
              <div className="activities-header">
                <h4>📝 直近の活動履歴</h4>
                <div className="activity-filters">
                  <select className="filter-select small">
                    <option>全ての活動</option>
                    <option>電話</option>
                    <option>メール</option>
                    <option>会議</option>
                    <option>訪問</option>
                  </select>
                  <select className="filter-select small">
                    <option>過去7日</option>
                    <option>過去14日</option>
                    <option>過去30日</option>
                  </select>
                </div>
              </div>
              
              {/* 活動サマリー */}
              <div className="activity-summary">
                <div className="summary-stats">
                  <div className="summary-stat">
                    <span className="stat-icon">📞</span>
                    <div className="stat-info">
                      <span className="stat-number">23</span>
                      <span className="stat-label">電話</span>
                    </div>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-icon">📧</span>
                    <div className="stat-info">
                      <span className="stat-number">15</span>
                      <span className="stat-label">メール</span>
                    </div>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-icon">🤝</span>
                    <div className="stat-info">
                      <span className="stat-number">8</span>
                      <span className="stat-label">会議</span>
                    </div>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-icon">🏢</span>
                    <div className="stat-info">
                      <span className="stat-number">12</span>
                      <span className="stat-label">訪問</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-timeline enhanced">
                {communications.slice(0, 12).map((comm, index) => (
                  <div key={index} className="activity-timeline-item enhanced">
                    <div className="activity-time">
                      <span className="activity-date">{comm.date}</span>
                      <span className="activity-hour">{comm.time}</span>
                      <span className="activity-duration">
                        {comm.duration ? `${comm.duration}分` : ''}
                      </span>
                    </div>
                    <div className="activity-icon">
                      {comm.type === '電話' && '📞'}
                      {comm.type === 'メール' && '📧'}
                      {comm.type === '会議' && '🤝'}
                      {comm.type === '訪問' && '🏢'}
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <h6>{comm.subject}</h6>
                        <span className={`priority-badge priority-${comm.priority}`}>
                          {comm.priority}
                        </span>
                      </div>
                      <div className="activity-customer">
                        <span className="customer-name">{comm.customerName}</span>
                        <span className="activity-type">{comm.type}</span>
                      </div>
                      <div className="activity-summary">
                        <p>{comm.summary}</p>
                      </div>
                      <div className="activity-meta">
                        {comm.participants && comm.participants.length > 0 && (
                          <div className="participants">
                            <span className="meta-label">参加者:</span>
                            <span className="meta-value">{comm.participants.slice(0, 2).join(', ')}</span>
                            {comm.participants.length > 2 && (
                              <span className="more-participants">他{comm.participants.length - 2}名</span>
                            )}
                          </div>
                        )}
                        {comm.nextAction && (
                          <div className="next-action">
                            <span className="meta-label">次のアクション:</span>
                            <span className="meta-value">{comm.nextAction}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="activity-actions">
                      <button className="action-btn">詳細</button>
                      <button className="action-btn">フォロー</button>
                    </div>
                  </div>
                ))}
                
                <div className="activity-load-more">
                  <button className="btn-secondary">さらに表示</button>
                </div>
              </div>
            </div>

            {/* 今日のタスク・予定 */}
            <div className="today-tasks">
              <div className="tasks-header">
                <h4>✅ 今日のタスク・予定</h4>
                <div className="task-summary">
                  <span className="task-count">
                    {tasks.filter(t => t.status !== '完了').length}件の未完了タスク
                  </span>
                  <span className="task-progress">
                    完了率: {Math.round((tasks.filter(t => t.status === '完了').length / tasks.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* タスク分類タブ */}
              <div className="task-tabs">
                <button className="task-tab active">全て</button>
                <button className="task-tab">高優先度</button>
                <button className="task-tab">期限今日</button>
                <button className="task-tab">フォローアップ</button>
              </div>

              <div className="task-list enhanced">
                {tasks.filter(t => t.status !== '完了').slice(0, 8).map((task, index) => (
                  <div key={index} className="task-item enhanced">
                    <div className="task-checkbox">
                      <input type="checkbox" className="task-check" />
                    </div>
                    <div className="task-priority">
                      <span className={`priority-dot priority-${task.priority}`}></span>
                    </div>
                    <div className="task-content">
                      <div className="task-header">
                        <h6>{task.title}</h6>
                        <span className={`task-status status-${task.status}`}>{task.status}</span>
                      </div>
                      <div className="task-details">
                        <p>{task.customerName && `${task.customerName} - `}{task.description}</p>
                        {task.relatedOpportunityId && (
                          <div className="task-opportunity">
                            <span className="opportunity-link">
                              関連案件: 案件ID {task.relatedOpportunityId}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="task-meta">
                        <div className="meta-item">
                          <span className="meta-icon">📅</span>
                          <span className="task-due">期限: {task.dueDate}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">👤</span>
                          <span className="task-assignee">{task.assignedTo}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">🏷️</span>
                          <span className="task-type">{task.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="task-actions">
                      <button className="action-btn small">編集</button>
                      <button className="action-btn small primary">完了</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 今日の予定 */}
              <div className="today-schedule">
                <h5>📅 今日の予定</h5>
                <div className="schedule-timeline">
                  {calendarEvents
                    .filter(event => event.date === new Date().toISOString().split('T')[0])
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((event, index) => (
                      <div key={index} className="schedule-item">
                        <div className="schedule-time">
                          <span className="start-time">{event.startTime}</span>
                          <span className="end-time">-{event.endTime}</span>
                        </div>
                        <div className="schedule-content">
                          <div className="schedule-header">
                            <span className="schedule-icon">
                              {event.type === 'visit' ? '🏢' : 
                               event.type === 'meeting' ? '🤝' : 
                               event.type === 'call' ? '📞' : 
                               event.type === 'demo' ? '💻' : '📋'}
                            </span>
                            <h6>{event.title}</h6>
                            <span className={`schedule-status status-${event.status}`}>
                              {event.status === 'scheduled' ? '予定' : 
                               event.status === 'completed' ? '完了' : 'キャンセル'}
                            </span>
                          </div>
                          <div className="schedule-details">
                            {event.customerName && (
                              <span className="schedule-customer">{event.customerName}</span>
                            )}
                            {event.location && (
                              <span className="schedule-location">📍 {event.location}</span>
                            )}
                          </div>
                          <div className="schedule-description">
                            <p>{event.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {calendarEvents.filter(event => event.date === new Date().toISOString().split('T')[0]).length === 0 && (
                    <div className="no-schedule">
                      <p>今日の予定はありません</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
