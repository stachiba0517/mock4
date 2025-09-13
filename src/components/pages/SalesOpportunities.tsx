import React from 'react';
import { SalesOpportunity, Analytics } from '../../types';

interface SalesOpportunitiesProps {
  opportunities: SalesOpportunity[];
  analytics: Analytics | null;
  onAddOpportunity: () => void;
}

const SalesOpportunities: React.FC<SalesOpportunitiesProps> = ({
  opportunities,
  analytics,
  onAddOpportunity
}) => {
  if (!analytics) {
    return <div>Loading opportunities...</div>;
  }

  return (
    <div className="sales-opportunities">
      <div className="section-header">
        <h2>🎯 営業プロセス・案件管理</h2>
        <button className="btn-primary" onClick={onAddOpportunity}>+ 新規案件追加</button>
      </div>

      <div className="opportunities-kanban">
        {analytics.pipelineAnalysis.stageDistribution.map((stage, stageIndex) => (
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
  );
};

export default SalesOpportunities;
