import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, logout } from "../firebaseConfig";
import { getSpotifyToken, logoutFromSpotify } from "../spotifyAuth";

interface AuthState {
  user: any | null;
  spotifyToken: string | null;
  customDisplayName: string | null; 
  bio: string | null;
  spotifyProfile: any | null;
  authInitialized: boolean;
  setUser: (user: any | null) => void;
  setSpotifyToken: (token: string | null) => void;
  setCustomDisplayName: (name: string | null) => void;
  setBio: (bio: string | null) => void;
  setSpotifyProfile: (profile: any | null) => void;
  setAuthInitialized: (initialized: boolean) => void;
  resetProfile: () => void;
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
      customDisplayName: null,
      bio: null,

      setUser: (user) => set((state) => {
        // If a different user logs in, reset custom display name & bio
        if (state.user?.uid !== user?.uid) {
          return { user, customDisplayName: null, bio: null };
        }
        return { user };
      }),
      setSpotifyToken: (token) => set({ spotifyToken: token }),
      setSpotifyProfile: (profile) => set((state) => {
        if (state.spotifyProfile?.id !== profile?.id) {
          return { spotifyProfile: profile, customDisplayName: null, bio: null };
        }
        return { spotifyProfile: profile };
      }),
      setAuthInitialized: (initialized) => set({ authInitialized: initialized }),
      setCustomDisplayName: (name) => set({ customDisplayName: name }),
      setBio: (bio) => set({ bio }),
      resetProfile: () => set({ customDisplayName: null, bio: null }),
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
