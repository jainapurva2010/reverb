import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForTokens } from "../spotifyAuth";

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeCodeForTokens(code).then((token) => {
        if (token) {
          navigate("/"); // Redirect to home after successful login
        } else {
          navigate("/login"); // Redirect to login if there was an issue
        }
      });
    } else {
      navigate("/login"); // No code? Go back to login
    }
  }, [navigate]);

  return <p>Processing Spotify Login...</p>;
};

export default Callback;
