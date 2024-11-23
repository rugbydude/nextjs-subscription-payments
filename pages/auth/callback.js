import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error) {
          router.push('/dashboard');
        } else {
          console.error('Error exchanging code for session:', error.message);
          router.push('/signin');
        }
      });
    }
  }, [router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Processing authentication...</h2>
        <p className="mt-2 text-gray-600">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
}
