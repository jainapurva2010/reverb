import React, { useEffect } from "react";
import { signInWithGoogle } from "../firebaseConfig";
import { loginWithSpotify } from "../spotifyAuth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Login: React.FC = () => {
  const navigate = useNavigate();
  // Retrieve authentication state from the Zustand store
  const { user, spotifyToken } = useAuthStore();

  useEffect(() => {
    // If user is already logged in (Google or Spotify), redirect to home page
    if (user || spotifyToken) {
      navigate("/", { replace: true });
    }
  }, [user, spotifyToken, navigate]);

  return (
    <div>
      <h1>Sign In to Reverb</h1>
      {/* Render login buttons only if no user is logged in */}
      {!(user || spotifyToken) ? (
        <>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
          <button onClick={loginWithSpotify}>Sign in with Spotify</button>
        </>
      ) : (
        <p>You are already logged in!</p>
      )}
    </div>
  );
};

export default Login;
