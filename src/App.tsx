import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { getSpotifyToken } from "./spotifyAuth";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Callback from "./pages/Callback";
import axios from "axios";

const App: React.FC = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [spotifyProfile, setSpotifyProfile] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let firebaseResolved = false;
    let spotifyResolved = false;

    // ✅ Check Firebase authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      firebaseResolved = true;
      checkAuthResolved(firebaseResolved, spotifyResolved);
    });

    // ✅ Check Spotify authentication
    const token = getSpotifyToken();
    if (token) {
      setSpotifyToken(token);

      axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSpotifyProfile(response.data);
        spotifyResolved = true;
        checkAuthResolved(firebaseResolved, spotifyResolved);
      })
      .catch((error) => {
        console.error("Error fetching Spotify profile:", error);
        spotifyResolved = true;
        checkAuthResolved(firebaseResolved, spotifyResolved);
      });
    } else {
      spotifyResolved = true;
      checkAuthResolved(firebaseResolved, spotifyResolved);
    }

    return () => unsubscribe();
  }, []);

  const checkAuthResolved = (firebaseDone: boolean, spotifyDone: boolean) => {
    if (!authInitialized && firebaseDone && spotifyDone) {
      setAuthInitialized(true);
    }
  };

  if (!authInitialized) {
    return null; // Prevent entire app from rendering until authentication is checked
  }

  return (
    <>
      <NavBar user={user} spotifyProfile={spotifyProfile} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </>
  );
};

export default App;
