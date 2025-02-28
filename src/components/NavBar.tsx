import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useAuthStore } from "../store/useAuthStore";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  
  // Get global auth state from Zustand
  const { user, spotifyToken, spotifyProfile } = useAuthStore();

  return (
    <nav className={styles.navbar}>
      {/* The logo is a clickable Link that navigates to "/" */}
      <Link to="/" className={`${styles.logo} ${styles.noLinkStyle}`}>
        🎵 Reverb
      </Link>

      <div className={styles.navLinks}>
        {/* Navigation links */}
        <Link to="/search" className={styles.link}>Search</Link>
      </div>

      <div className={styles.userSection}>
        {/* If a user is logged in (Google or Spotify), display their info */}
        {user || spotifyProfile || spotifyToken ? (
          <div className={styles.userInfo} onClick={() => navigate("/profile")}>
            {user ? (
              <>
                <img 
                  src={user.photoURL ?? "https://via.placeholder.com/32"} 
                  alt="Profile" 
                  className={styles.profilePic} 
                />
                <span>{user.displayName}</span>
              </>
            ) : spotifyProfile ? (
              <>
                {spotifyProfile.images.length > 0 && (
                  <img 
                    src={spotifyProfile.images[0].url} 
                    alt="Spotify Profile" 
                    className={styles.profilePic} 
                  />
                )}
                <span>{spotifyProfile.display_name}</span>
              </>
            ) : null}
          </div>
        ) : (
          // Otherwise, show the "Log In" button
          <button 
            className={styles.loginButton} 
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
