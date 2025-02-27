import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, logout } from "../firebaseConfig";
import { getSpotifyToken, logoutFromSpotify } from "../spotifyAuth";
import styles from "./NavBar.module.css"; 
import axios from "axios";

const NavBar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [spotifyProfile, setSpotifyProfile] = useState<any>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Fetch Spotify user info if logged in
    if (spotifyToken) {
      axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      })
      .then((response) => {
        setSpotifyProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Spotify profile:", error);
      });
    }
  }, [spotifyToken]);

  const handleLogout = async () => {
    await logout(); // Logs out Google
    logoutFromSpotify(navigate); // Logs out Spotify and redirects

    setUser(null);
    setSpotifyToken(null);
    setSpotifyProfile(null);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🎵 Reverb</div>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/search" className={styles.link}>Search</Link>
        <Link to="/profile" className={styles.link}>Profile</Link>
      </div>

      {/* Show user info if logged in */}
      {user && (
        <div className={styles.userInfo}>
          <img src={user.photoURL} alt="Profile" className={styles.profilePic} />
          <span>{user.displayName}</span>
        </div>
      )}

      {spotifyProfile && !user && (
        <div className={styles.userInfo}>
          {spotifyProfile.images.length > 0 && (
            <img src={spotifyProfile.images[0].url} alt="Spotify Profile" className={styles.profilePic} />
          )}
          <span>{spotifyProfile.display_name}</span>
        </div>
      )}

      {/* Show "Login" if no user is logged in, else show "Logout" */}
      {!user && !spotifyToken ? (
        <Link to="/login" className={styles.link}>Log In</Link>
      ) : (
        <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
      )}
    </nav>
  );
};

export default NavBar;
