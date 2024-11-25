import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session:', session); // Debugging line
        if (error) throw error;
        if (!session) {
          console.log('No session, redirecting to /signin'); // Debugging line
          router.push('/signin');
        } else {
          console.log('Session found, redirecting to /dashboard'); // Debugging line
          router.push('/dashboard'); // Redirect to dashboard if authenticated
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed, session:', session); // Debugging line
      if (!session) {
        router.push('/signin');
      } else {
        router.push('/dashboard'); // Redirect to dashboard if authenticated
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
