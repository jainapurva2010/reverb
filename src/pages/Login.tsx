import React, { useEffect, useState }  from "react";
import { signInWithGoogle } from "../firebaseConfig";
import { loginWithSpotify, getSpotifyToken } from "../spotifyAuth";

const Login: React.FC = () => {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getSpotifyToken();
    if (token) {
      setSpotifyToken(token);
      console.log("Spotify token:", token);
    }
  }, []);

  return (
    <div>
      <h1>Sign In to Reverb</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={loginWithSpotify}>Sign in with Spotify</button>
      {spotifyToken && <p>Logged in with Spotify!</p>}
    </div>
  );
};

export default Login;
