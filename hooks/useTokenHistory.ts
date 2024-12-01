import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import { supabase, getTokenTransactions, getTokenUsage } from '../lib/supabase';
import { TokenTransaction, TokenUsage, TokenStats } from '../types/token';

interface UseTokenHistoryReturn {
  transactions: TokenTransaction[];
  usage: TokenUsage[];
  stats: TokenStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTokenHistory(): UseTokenHistoryReturn {
  const { user } = useUser();
  const [data, setData] = useState<{
    transactions: TokenTransaction[];
    usage: TokenUsage[];
    stats: TokenStats;
  }>({
    transactions: [],
    usage: [],
    stats: {
      dailyUsage: [],
      usageByFeature: [],
      usageByProject: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTokenHistory() {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [transactions, usage, dailyUsage, featureUsage, projectUsage] = await Promise.all([
        getTokenTransactions(user.id),
        getTokenUsage(user.id),
        supabase
          .from('token_daily_usage')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(30),
        supabase
          .from('token_feature_usage')
          .select('*')
          .eq('user_id', user.id)
          .order('tokens', { ascending: false }),
        supabase
          .from('token_project_usage')
          .select('*')
          .eq('user_id', user.id)
          .order('tokens', { ascending: false })
      ]);

      if (dailyUsage.error) throw dailyUsage.error;
      if (featureUsage.error) throw featureUsage.error;
      if (projectUsage.error) throw projectUsage.error;

      setData({
        transactions,
        usage,
        stats: {
          dailyUsage: dailyUsage.data,
          usageByFeature: featureUsage.data,
          usageByProject: projectUsage.data,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch token history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchTokenHistory();

      // Subscribe to token transactions
      const transactionSubscription = supabase
        .channel('token_transactions')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'token_transactions',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchTokenHistory();
          }
        )
        .subscribe();

      // Subscribe to token usage
      const usageSubscription = supabase
        .channel('token_usage')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'token_usage',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchTokenHistory();
          }
        )
        .subscribe();

      return () => {
        transactionSubscription.unsubscribe();
        usageSubscription.unsubscribe();
      };
    }
  }, [user]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchTokenHistory,
  };
} 