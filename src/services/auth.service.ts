import { supabase } from '../lib/supabase';
import { AuthCredentials, User } from '../types/auth';

export class AuthService {
  static async login({ email, password }: AuthCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user data returned');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw new Error(userError.message);
    if (!userData) throw new Error('User not found');

    return userData;
  }

  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }
}