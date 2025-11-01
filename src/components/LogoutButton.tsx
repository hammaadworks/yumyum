'use client';

import { createClient } from '@/lib/supabase/utils/client';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-md bg-red-500 text-white"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
