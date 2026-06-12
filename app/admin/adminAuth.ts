const ADMIN_KEY = "rayos_admin_logged_in";

export const adminAuth = {
  login: (password: string) => {
    const correctPassword = "admin123";

    if (password.trim() === correctPassword) {
      if (typeof window !== "undefined") {
        localStorage.setItem(ADMIN_KEY, "true");
      }
      return true;
    }

    return false;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_KEY);
    }
  },

  isLoggedIn: () => {
    if (typeof window === "undefined") return false;

    return localStorage.getItem(ADMIN_KEY) === "true";
  },
};