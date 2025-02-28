import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForTokens } from "../spotifyAuth";
import { useAuthStore } from "../store/useAuthStore";

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const { setSpotifyToken, setSpotifyProfile } = useAuthStore();

  useLayoutEffect(() => {
    console.log("🚀 Callback page loaded!");

    // Extract the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log("🔑 Authorization Code from URL:", code);

    // If no code is found, redirect to login immediately
    if (!code) {
      console.error("❌ No authorization code found. Redirecting to login...");
      navigate("/login", { replace: true });
      return;
    }

    // Define an async function to handle token exchange and profile fetching
    const processSpotifyLogin = async () => {
      const token = await exchangeCodeForTokens(code);
      if (token) {
        // Update the global state with the retrieved token
        setSpotifyToken(token);
        try {
          // Fetch the user's Spotify profile using the access token
          const res = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setSpotifyProfile(data);
          console.log("✅ Stored Spotify profile:", data);
          // Redirect to home page after successful login and state update
          navigate("/", { replace: true });
        } catch (error) {
          console.error("❌ Error fetching Spotify profile:", error);
          navigate("/login", { replace: true });
        }
      } else {
        console.error("❌ Token exchange failed. Redirecting to login...");
        navigate("/login", { replace: true });
      }
    };

    // Call the async function
    processSpotifyLogin();
  }, [navigate, setSpotifyToken, setSpotifyProfile]);

  // Render nothing; the effect handles the redirection
  return null;
};

export default Callback;
