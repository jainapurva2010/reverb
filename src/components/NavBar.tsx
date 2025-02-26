import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./NavBar.module.css"; 
import { auth, logout } from "../firebaseConfig";
import { getSpotifyToken, logoutFromSpotify } from "../spotifyAuth";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in with Google
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Check if user is logged in with Spotify
    const token = getSpotifyToken();
    setSpotifyToken(token);

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logout(); // Logs out Google
    logoutFromSpotify(navigate); // Logs out Spotify and redirects

    setUser(null);
    setSpotifyToken(null);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🎵 Reverb</div>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/search" className={styles.link}>Search</Link>
        <Link to="/profile" className={styles.link}>Profile</Link>

        {/* Show "Login" if no user is logged in, else show "Logout" */}
        {!user && !spotifyToken ? (
          <Link to="/login" className={styles.link}>Log In</Link>
        ) : (
          <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
