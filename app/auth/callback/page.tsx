'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) return;

        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (!data.session) {
          console.error('No session data received');
          throw new Error('No session data received');
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (userError) {
          console.error('User data error:', userError);
          throw userError;
        }

        // Successfully authenticated and got user data
        router.push('/dashboard');
      } catch (err: any) {
        console.error('Authentication error:', err);
        setError(err.message);
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      }
    };

    handleAuth();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600">Authentication Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <p className="mt-2 text-gray-500">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Processing authentication...</h2>
        <p className="mt-2 text-gray-600">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
}
