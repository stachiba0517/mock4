// データ型定義
export interface Customer {
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

export interface SalesOpportunity {
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

export interface Communication {
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

export interface Task {
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

export interface CalendarEvent {
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

export interface DailyReport {
  id: number;
  date: string;
  salesPerson: string;
  workingHours: {
    start: string;
    end: string;
    break: number; // 休憩時間（分）
  };
  activities: Array<{
    id: number;
    type: 'visit' | 'call' | 'email' | 'meeting' | 'proposal' | 'other';
    customerId: number | null;
    customerName: string;
    startTime: string;
    endTime: string;
    description: string;
    result: string;
    nextAction: string;
    priority: '高' | '中' | '低';
  }>;
  achievements: {
    newLeads: number;
    meetings: number;
    proposals: number;
    contracts: number;
    revenue: number;
  };
  challenges: string;
  tomorrowPlan: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
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
