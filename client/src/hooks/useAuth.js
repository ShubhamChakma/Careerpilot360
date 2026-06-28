import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { setUser, clearUser, setLoading, user, loading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else clearUser();
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user, loading };
}