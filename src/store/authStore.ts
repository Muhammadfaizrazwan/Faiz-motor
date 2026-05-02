import { create } from "zustand";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface AuthState {
  user: AuthUser | null;
  savedCount: number;
  setUser: (user: AuthUser | null) => void;
  setSavedCount: (count: number) => void;
  incrementSavedCount: () => void;
  decrementSavedCount: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  savedCount: 0,
  setUser: (user) => set({ user }),
  setSavedCount: (count) => set({ savedCount: count }),
  incrementSavedCount: () => set((state) => ({ savedCount: state.savedCount + 1 })),
  decrementSavedCount: () =>
    set((state) => ({ savedCount: Math.max(0, state.savedCount - 1) })),
}));
