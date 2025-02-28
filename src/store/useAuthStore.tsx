import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, logout } from "../firebaseConfig";
import { getSpotifyToken, logoutFromSpotify } from "../spotifyAuth";

interface AuthState {
  user: any | null;
  spotifyToken: string | null;
  spotifyProfile: any | null;
  authInitialized: boolean;
  setUser: (user: any | null) => void;
  setSpotifyToken: (token: string | null) => void;
  setSpotifyProfile: (profile: any | null) => void;
  setAuthInitialized: (initialized: boolean) => void;
  logoutUser: () => Promise<void>;
  logoutSpotify: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: auth.currentUser,
      spotifyToken: getSpotifyToken(),
      spotifyProfile: null,
      authInitialized: false,

      setUser: (user) => set({ user }),
      setSpotifyToken: (token) => set({ spotifyToken: token }),
      setSpotifyProfile: (profile) => set({ spotifyProfile: profile }),
      setAuthInitialized: (initialized) => set({ authInitialized: initialized }),

      logoutUser: async () => {
        await logout();
        set({ user: null });
      },

      logoutSpotify: () => {
        logoutFromSpotify(() => {});
        set({ spotifyToken: null, spotifyProfile: null });
      },
    }),
    { name: "auth-store" } // Persist authentication state
  )
);
