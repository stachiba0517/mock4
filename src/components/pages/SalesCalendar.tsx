import React from 'react';
import { CalendarEvent } from '../../types';

interface SalesCalendarProps {
  calendarEvents: CalendarEvent[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onAddEvent: () => void;
}

const SalesCalendar: React.FC<SalesCalendarProps> = ({
  calendarEvents,
  selectedDate,
  onDateChange,
  onAddEvent
}) => {
  return (
    <div className="sales-calendar">
      <div className="section-header">
        <h2>📅 営業カレンダー</h2>
        <button className="btn-primary" onClick={onAddEvent}>+ 予定追加</button>
      </div>

      <div className="calendar-controls">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
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
                onDateChange(date.toISOString().split('T')[0]);
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
                onDateChange(date.toISOString().split('T')[0]);
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
                      onClick={() => onDateChange(dayStr)}
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
  );
};

export default SalesCalendar;
