import React, { useEffect, useState }  from "react";
import { signInWithGoogle, auth } from "../firebaseConfig";
import { loginWithSpotify, getSpotifyToken } from "../spotifyAuth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
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

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user || spotifyToken) {
      navigate("/"); // Redirect to home if logged in
    }
  }, [user, spotifyToken, navigate]);

  return (
    <div>
      <h1>Sign In to Reverb</h1>
      {/* Show login buttons only if user is NOT logged in */}
      {!user && !spotifyToken ? (
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
