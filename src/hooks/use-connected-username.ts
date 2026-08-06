import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useConnectedUsername() {
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const key = user?.id ? `lc_username_${user.id}` : 'lc_username';
    const localSaved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    
    if (localSaved) {
      setUsername(localSaved);
      setLoading(false);
    }

    // Sync from Supabase database endpoint if logged in
    if (user?.id) {
      fetch('/api/user/sync')
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.leetcodeUsername) {
            const dbUsername = data.user.leetcodeUsername;
            setUsername(dbUsername);
            if (typeof window !== 'undefined') {
              localStorage.setItem(key, dbUsername);
            }
          }
        })
        .catch((err) => console.warn('Supabase sync fetch warning:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id, isLoaded]);

  function setConnectedUsername(newUsername: string | null) {
    const key = user?.id ? `lc_username_${user.id}` : 'lc_username';
    if (typeof window !== 'undefined') {
      if (newUsername) {
        localStorage.setItem(key, newUsername);
      } else {
        localStorage.removeItem(key);
      }
    }
    setUsername(newUsername);

    // Persist to database if logged in
    if (user?.id) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leetcodeUsername: newUsername }),
      }).catch((err) => console.warn('Supabase sync post warning:', err));
    }
  }

  return { username, setConnectedUsername, loading, isLoaded };
}
