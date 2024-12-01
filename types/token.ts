export type TransactionType = 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS';

export interface TokenTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  description: string;
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface TokenUsage {
  id: string;
  user_id: string;
  tokens: number;
  feature: string;
  project_id: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TokenBalance {
  token_balance: number;
  lifetime_purchased: number;
  lifetime_used: number;
  last_purchase_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TokenStats {
  dailyUsage: Array<{
    id: string;
    user_id: string;
    date: string;
    tokens: number;
    created_at: string;
    updated_at: string;
  }>;
  usageByFeature: Array<{
    id: string;
    user_id: string;
    feature: string;
    tokens: number;
    created_at: string;
    updated_at: string;
  }>;
  usageByProject: Array<{
    id: string;
    user_id: string;
    project_id: string;
    project_name: string;
    tokens: number;
    created_at: string;
    updated_at: string;
  }>;
} 