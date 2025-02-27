import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { getSpotifyToken } from "../spotifyAuth";
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

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🎵 Reverb</div>
      <div className={styles.navLinks}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/search" className={styles.link}>Search</Link>
      </div>

      <div className={styles.userSection}>
        {user || spotifyProfile ? (
          // User is logged in -> Show profile info
          <div className={styles.userInfo} onClick={() => navigate("/profile")}>
            {user && (
              <>
                <img src={user.photoURL} alt="Profile" className={styles.profilePic} />
                <span>{user.displayName}</span>
              </>
            )}

            {spotifyProfile && !user && (
              <>
                {spotifyProfile.images.length > 0 && (
                  <img src={spotifyProfile.images[0].url} alt="Spotify Profile" className={styles.profilePic} />
                )}
                <span>{spotifyProfile.display_name}</span>
              </>
            )}
          </div>
        ) : (
          // No user logged in -> Show Log In button
          <button className={styles.loginButton} onClick={() => navigate("/login")}>
            Log In
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
