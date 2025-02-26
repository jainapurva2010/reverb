import axios from "axios";

const CLIENT_ID = "8723d4814d08440b84abc2f3f021f5fc";
const REDIRECT_URI = "http://localhost:5173/login";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

export const loginWithSpotify = () => {
  window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
};

export const getSpotifyToken = () => {
  const hash = window.location.hash;
  let token = localStorage.getItem("spotify_token");

  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.substring(1));
    token = params.get("access_token");

    if (token) {
      localStorage.setItem("spotify_token", token); 
      window.history.replaceState(null, "", window.location.pathname); 
    }
  }

  return token;
};

export const logoutFromSpotify = (navigate: (path: string) => void) => {
  window.location.hash = ""; // Clears the token from the URL
  localStorage.removeItem("spotify_token"); // Clear stored token
  navigate("/login"); // Redirects user to home page
};

