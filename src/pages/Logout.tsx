import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logoutSpotify } = useAuthStore();

  useEffect(() => {
    // Call the logoutSpotify action to clear Spotify auth state
    logoutSpotify();
    // Redirect to home after logging out
    navigate("/", { replace: true });
  }, [navigate, logoutSpotify]);

  return <p>Logging out...</p>;
};

export default Logout;
