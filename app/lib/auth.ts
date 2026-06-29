import { supabase } from "./supabase";

export const auth = {
  // Register
  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password,
    });
  },

  // Login
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Logout
  async signOut() {
    return await supabase.auth.signOut();
  },

  // Current user
  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  },
};