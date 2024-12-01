import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { TokenTransaction, TokenUsage } from '../types/token';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function getTokenBalance(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('token_balance, lifetime_purchased, lifetime_used, last_purchase_date')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getTokenTransactions(userId: string): Promise<TokenTransaction[]> {
  const { data, error } = await supabase
    .from('token_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as TokenTransaction[];
}

export async function getTokenUsage(userId: string): Promise<TokenUsage[]> {
  const { data, error } = await supabase
    .from('token_usage')
    .select(`
      *,
      projects (
        name
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as TokenUsage[];
}

export async function recordTokenTransaction(
  userId: string,
  amount: number,
  type: 'PURCHASE' | 'USAGE' | 'REFUND' | 'BONUS',
  description: string,
  metadata?: Record<string, any>
): Promise<TokenTransaction> {
  const { data, error } = await supabase
    .from('token_transactions')
    .insert({
      user_id: userId,
      amount,
      type,
      description,
      metadata,
    })
    .select()
    .single();

  if (error) throw error;
  return data as TokenTransaction;
}

export async function recordTokenUsage(
  userId: string,
  tokens: number,
  feature: string,
  description: string,
  projectId?: string
): Promise<TokenUsage> {
  const { data, error } = await supabase
    .from('token_usage')
    .insert({
      user_id: userId,
      tokens,
      feature,
      description,
      project_id: projectId,
    })
    .select()
    .single();

  if (error) throw error;

  // Also record the transaction
  await recordTokenTransaction(
    userId,
    -tokens,
    'USAGE',
    description,
    { feature, projectId }
  );

  return data as TokenUsage;
} 