import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { useAuthStore } from '../store/authStore';
import { mockUsers } from '../config/demo';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use demo values if environment variables are not set
const demoUrl = 'https://demo.supabase.co';
const demoKey = 'demo-key';

export const supabase = createClient<Database>(
  supabaseUrl || demoUrl,
  supabaseKey || demoKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Override auth methods for demo
if (!supabaseUrl || !supabaseKey) {
  supabase.auth.signInWithPassword = async ({ email }) => {
    const user = mockUsers[email as keyof typeof mockUsers];
    if (user) {
      return { data: { user }, error: null };
    }
    return { data: { user: null }, error: new Error('Invalid credentials') };
  };
}

export const initSupabaseAuth = () => {
  const { setUser, setLoading } = useAuthStore.getState();
  
  // Simulate initial loading
  setTimeout(() => {
    setLoading(false);
  }, 1000);
  
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      try {
        // In demo mode, use mock user data
        if (!supabaseUrl || !supabaseKey) {
          const mockUser = mockUsers[session.user.email as keyof typeof mockUsers];
          if (mockUser) {
            setUser(mockUser);
            setLoading(false);
            return;
          }
        }

        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      setLoading(false);
    }
  });
};