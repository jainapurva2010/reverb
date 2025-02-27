import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./NavBar.module.css";

interface NavBarProps {
  user: any;
  spotifyProfile: any;
}

const NavBar: React.FC<NavBarProps> = ({ user, spotifyProfile }) => {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🎵 Reverb</div>
      <div className={styles.navLinks}>
        <Link to="/" className={styles.link}>Home</Link>
        <Link to="/search" className={styles.link}>Search</Link>
      </div>

      <div className={styles.userSection}>
        {user || spotifyProfile ? (
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
