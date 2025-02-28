import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { getSpotifyToken } from "./spotifyAuth";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Callback from "./pages/Callback";
import Logout from "./pages/Logout";
import axios from "axios";
import { useAuthStore } from "./store/useAuthStore";

const App: React.FC = () => {
  // Destructure Zustand store
  const {
    user,
    spotifyToken,
    spotifyProfile,
    setUser,
    setSpotifyToken,
    setSpotifyProfile,
    authInitialized,
    setAuthInitialized,
  } = useAuthStore();

  useEffect(() => {
    // Local flags to determine when each auth check has completed.
    let firebaseResolved = false;
    let spotifyResolved = false;

    // Firebase authentication check
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      firebaseResolved = true;
      if (firebaseResolved && spotifyResolved && !authInitialized) {
        setAuthInitialized(true);
      }
    });

    // Spotify authentication check
    const token = getSpotifyToken();
    if (token) {
      setSpotifyToken(token);
      axios
        .get("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setSpotifyProfile(response.data);
          spotifyResolved = true;
          if (firebaseResolved && spotifyResolved && !authInitialized) {
            setAuthInitialized(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching Spotify profile:", error);
          spotifyResolved = true;
          if (firebaseResolved && spotifyResolved && !authInitialized) {
            setAuthInitialized(true);
          }
        });
    } else {
      // If there's no Spotify token, consider the Spotify check resolved.
      spotifyResolved = true;
      if (firebaseResolved && spotifyResolved && !authInitialized) {
        setAuthInitialized(true);
      }
    }

    return () => {
      unsubscribe();
    };
  }, [setUser, setSpotifyToken, setSpotifyProfile, authInitialized, setAuthInitialized]);

  // Prevent rendering until both authentication checks are complete.
  if (!authInitialized) {
    return null;
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
};

export default App;
