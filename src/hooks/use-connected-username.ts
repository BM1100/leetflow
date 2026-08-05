import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useConnectedUsername() {
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window !== 'undefined') {
      // Key storage per Clerk user ID if logged in, fallback to generic key
      const key = user?.id ? `lc_username_${user.id}` : 'lc_username';
      const saved = localStorage.getItem(key);
      setUsername(saved);
    }
    setLoading(false);
  }, [user?.id, isLoaded]);

  function setConnectedUsername(newUsername: string | null) {
    if (typeof window !== 'undefined') {
      const key = user?.id ? `lc_username_${user.id}` : 'lc_username';
      if (newUsername) {
        localStorage.setItem(key, newUsername);
      } else {
        localStorage.removeItem(key);
      }
    }
    setUsername(newUsername);
  }

  return { username, setConnectedUsername, loading, isLoaded };
}
