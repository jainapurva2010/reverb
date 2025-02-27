import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { getSpotifyToken } from "../spotifyAuth";

interface NavBarProps {
  user: any;
  spotifyProfile: any;
}

const NavBar: React.FC<NavBarProps> = ({ user, spotifyProfile }) => {
  const navigate = useNavigate();
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      console.log("🔄 Checking Spotify token...");
      setSpotifyToken(getSpotifyToken());
    };

    checkToken(); // Run on mount
    const interval = setInterval(checkToken, 1000); // 🚀 Check every second

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={`${styles.logo} ${styles.noLinkStyle}`}>🎵 Reverb</Link>

      <div className={styles.navLinks}>
        <Link to="/search" className={styles.link}>Search</Link>
      </div>

      <div className={styles.userSection}>
        {user || spotifyProfile || spotifyToken ? (
          <div className={styles.userInfo} onClick={() => navigate("/profile")}>
            {user && (
              <>
                <img src={user.photoURL ?? "https://via.placeholder.com/32"} alt="Profile" className={styles.profilePic} />
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
          <button className={styles.loginButton} onClick={() => navigate("/login")}>
            Log In
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
