import axios, { AxiosError} from "axios";

export const loginWithSpotify = () => {
  console.log("🚀 loginWithSpotify() triggered!");

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const CLIENT_ID = "8723d4814d08440b84abc2f3f021f5fc";
  const REDIRECT_URI = "http://localhost:5173/callback"; 
  const RESPONSE_TYPE = "code";
  const SCOPES = "user-read-private user-read-email";

  const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;

  console.log("🔗 Redirecting to Spotify Auth URL:", authUrl);

  window.location.href = authUrl;
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

export const exchangeCodeForTokens = async (code: string) => {
  try {
    const response = await axios.post("http://localhost:3001/auth/spotify", { code });

    if (response.data.access_token) {
      const { access_token, refresh_token, expires_in } = response.data;

      localStorage.setItem("spotify_token", access_token);
      localStorage.setItem("spotify_refresh_token", refresh_token);
      localStorage.setItem("spotify_token_expiry", (Date.now() + expires_in * 1000).toString());

      return access_token;
    } else {
      console.error("❌ Token exchange response missing access_token.");
      return null;
    }
  } catch (err: unknown) {
    const error = err as AxiosError;
    console.error("❌ Failed to exchange code for tokens:", error.response?.data || error.message);
    return null;
  }
};


export const refreshSpotifyToken = async () => {
  const refresh_token = localStorage.getItem("spotify_refresh_token");

  if (!refresh_token) return null;

  try {
    const response = await axios.post("http://localhost:3001/refresh", { refresh_token });
    const { access_token, expires_in } = response.data;

    localStorage.setItem("spotify_token", access_token);
    localStorage.setItem("spotify_token_expiry", (Date.now() + expires_in * 1000).toString());

    return access_token;
  } catch (error) {
    console.error("❌ Failed to refresh Spotify token", error);
    return null;
  }
};

export const logoutFromSpotify = (navigate: (path: string) => void) => {
  window.location.hash = ""; // Clears the token from the URL
  localStorage.removeItem("spotify_token"); // Clear stored token
  navigate("/login"); // Redirects user to home page
};

