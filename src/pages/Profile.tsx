import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    spotifyProfile,
    spotifyToken,
    customDisplayName,
    bio,
    setCustomDisplayName,
    setBio,
    logoutUser,
    logoutSpotify,
  } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(customDisplayName || "");
  const [editedBio, setEditedBio] = useState(bio || "");

  const handleSave = () => {
    setCustomDisplayName(editedName.trim() !== "" ? editedName : null);
    setBio(editedBio.trim() !== "" ? editedBio : null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(customDisplayName || "");
    setEditedBio(bio || "");
    setIsEditing(false);
  };
  
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

  // Determine display name: Custom name or original from Google/Spotify
  const originalDisplayName = user?.displayName || spotifyProfile?.display_name;
  const displayName = customDisplayName || originalDisplayName;

  return (
    <div className={styles.profileContainer}>
      <h1>My Profile</h1>
      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <img
            src={
              user?.photoURL ||
              spotifyProfile?.images?.[0]?.url ||
              `https://ui-avatars.com/api/?name=${originalDisplayName}`
            }
            alt="Profile"
            className={styles.profilePic}
          />
          {isEditing ? (
            <div className={styles.editForm}>
              <input
                type="text"
                placeholder="Enter display name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className={styles.inputField}
              />
              <textarea
                placeholder="Enter bio"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className={styles.textArea}
              />
              <div className={styles.editButtons}>
                <button onClick={handleSave} className={styles.saveButton}>Save</button>
                <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h2>{displayName}</h2>
              <p>{bio || ""}</p>
            </>
          )}
          <div className={styles.buttonGroup}>
            <button onClick={() => setIsEditing(true)} className={styles.editButton}>
              Edit Profile
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
