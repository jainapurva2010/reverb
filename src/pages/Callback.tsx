import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForTokens } from "../spotifyAuth";

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 Callback page loaded!");

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("🔑 Authorization Code from URL:", code);

    if (!code) {
      console.error("❌ No authorization code found in URL. Redirecting to login...");
      navigate("/login");
      return;
    }

    exchangeCodeForTokens(code).then((token) => {
      if (token) {
        window.location.href = "/"; // 🚀 Full page reload to ensure fresh state
      } else {
        console.error("❌ Token exchange failed. Redirecting to login...");
        navigate("/login");
      }
    });
  }, [navigate]);

  return <p>Processing Spotify Login...</p>;
};

export default Callback;
