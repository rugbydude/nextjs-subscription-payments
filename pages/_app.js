import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets up auth state listener
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        // If we're on the signin page and have a session, redirect to dashboard
        if (session && router.pathname === '/signin') {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && router.pathname === '/signin') {
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        router.push('/signin');
      }
    });

    // Cleanup subscription
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [router]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return <Component {...pageProps} />;
}

export default MyApp;
