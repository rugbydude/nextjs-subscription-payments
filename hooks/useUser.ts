import { useEffect, useState } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setUser(session?.user ?? null);

        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user ?? null);
          }
        );

        return () => {
          authSubscription.unsubscribe();
        };
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get user'));
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [supabase.auth]);

  return { user, loading, error };
} 