import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, spotifyProfile, spotifyToken, logoutUser, logoutSpotify } = useAuthStore();

  // Function to get profile image
  const getProfileImage = () => {
    if (user?.photoURL) return user.photoURL; // Google profile
    if (spotifyProfile?.images?.length > 0) return spotifyProfile.images[0].url; // Spotify profile

    // Default profile image using UI Avatar API
    const displayName = user?.displayName || spotifyProfile?.display_name || "Guest";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=100`;
  };

  // Logout function
  const handleLogout = async () => {
    if (user) {
      await logoutUser();
    } else if (spotifyToken) {
      logoutSpotify();
    }
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.profileContainer}>
      <h1>My Profile</h1>
      <div className={styles.profileCard}>
        <img
          src={getProfileImage()}
          alt="Profile"
          className={styles.profilePic}
        />
        <div>
          <h2>{user?.displayName || spotifyProfile?.display_name || "Guest"}</h2>
          <p>{user?.email || spotifyProfile?.email || "No email available"}</p>
          <p>Logged in via {user ? "Google" : "Spotify"}</p>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
