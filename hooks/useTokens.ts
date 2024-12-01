// hooks/useTokens.ts
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileChanges = {
  token_balance?: number;
  lifetime_purchased?: number;
  lifetime_used?: number;
  last_purchase_date?: string | null;
};

interface UseTokensReturn {
  balance: number | null;
  loading: boolean;
  error: Error | null;
  isUpdating: boolean;
  consumeTokens: (amount: number, description: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
}

export function useTokens(): UseTokensReturn {
  const { user } = useUser();
  const [balance, setBalance] = useState<number | null>(null);
  const [optimisticBalance, setOptimisticBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function fetchBalance() {
    if (!user) {
      setError(new Error('User not authenticated'));
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('token_balance')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;
      setBalance(data?.token_balance ?? 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch token balance'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchBalance();

      const subscription = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            const newData = payload.new as Profile;
            if (newData && typeof newData.token_balance === 'number') {
              setBalance(newData.token_balance);
              setOptimisticBalance(null);
              setError(null);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  async function consumeTokens(amount: number, description: string) {
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (balance === null) {
      throw new Error('Token balance not loaded');
    }

    const newBalance = balance - amount;
    if (newBalance < 0) {
      throw new Error('Insufficient tokens');
    }

    setIsUpdating(true);
    setOptimisticBalance(newBalance);

    try {
      const { error: updateError } = await supabase.rpc('consume_tokens', {
        amount_to_consume: amount,
        description,
      });

      if (updateError) throw updateError;
    } catch (err) {
      setOptimisticBalance(null);
      throw err instanceof Error ? err : new Error('Failed to consume tokens');
    } finally {
      setIsUpdating(false);
    }
  }

  return {
    balance: optimisticBalance ?? balance,
    loading,
    error,
    isUpdating,
    consumeTokens,
    refreshBalance: fetchBalance,
    clearError: () => setError(null),
  };
}
