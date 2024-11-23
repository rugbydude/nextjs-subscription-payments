import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    const session = supabase.auth.session();
    if (!session) {
      router.push('/signin');
    }
  }, []);
  return <>{children}</>;
};

export default ProtectedRoute;
